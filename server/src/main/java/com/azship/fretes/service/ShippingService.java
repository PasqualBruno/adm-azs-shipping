package com.azship.fretes.service;

import com.azship.fretes.dto.PaginatedResponse;
import com.azship.fretes.dto.ShippingRequest;
import com.azship.fretes.dto.ShippingResponse;
import com.azship.fretes.model.Shipping;
import com.azship.fretes.repository.CompanyRepository;
import com.azship.fretes.repository.ShippingRepository;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class ShippingService {


    private static final String SHIPPING_COLLECTION_NAME = "shippings"; // ⚠️ MUDE AQUI SE NECESSÁRIO
    private static final String COMPANY_COLLECTION_NAME = "companies"; // Você disse que era "companies"
    // ==========================================================

    private final ShippingRepository shippingRepository;
    private final CompanyRepository companyRepository;
    private final MongoTemplate mongoTemplate;

    public ShippingService(ShippingRepository shippingRepository,
                           CompanyRepository companyRepository,
                           MongoTemplate mongoTemplate) {
        this.shippingRepository = shippingRepository;
        this.companyRepository = companyRepository;
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * Classe auxiliar interna para receber o resultado da contagem total.
     */
    private static class TotalCount {
        private long total;
        public long getTotal() { return total; }
        public void setTotal(long total) { this.total = total; }
    }

    // ==========================================================
    // Listagem com join, busca e paginação
    // ==========================================================
    public PaginatedResponse<ShippingResponse> listShippings(int page, int limit, String search) {

        // 1. Construir o Pipeline de Agregação
        // Esta é a lista de etapas que o MongoDB executará
        List<AggregationOperation> pipeline = new ArrayList<>();

        // Etapa 1: Converter a String "company" para um "company_oid" (ObjectId)
        // Isto é OBRIGATÓRIO para o join funcionar.
        pipeline.add(context -> new org.bson.Document("$addFields",
                new org.bson.Document("company_oid",
                        new org.bson.Document("$convert",
                                new org.bson.Document("input", "$company")
                                        .append("to", "objectId")
                                        .append("onError", null)
                                        .append("onNull", null)
                        )
                )
        ));

        // Etapa 2: Fazer o $lookup (join) com a coleção de empresas
        pipeline.add(Aggregation.lookup(COMPANY_COLLECTION_NAME, "company_oid", "_id", "companyDetails"));

        // Etapa 3: Descompactar o resultado do lookup
        // O $unwind transforma o array "companyDetails" (que só tem 1 item) no objeto "companyDetails"
        // "preserveNullAndEmptyArrays: true" garante que, se um frete não tiver empresa, ele ainda apareça
        pipeline.add(Aggregation.unwind("$companyDetails", true));

        // Etapa 4: Adicionar o filtro de busca (se houver)
        if (search != null && !search.isEmpty()) {
            Pattern regex = Pattern.compile(search, Pattern.CASE_INSENSITIVE);

            List<Criteria> searchCriteria = new ArrayList<>();
            searchCriteria.add(Criteria.where("estado").regex(regex));
            searchCriteria.add(Criteria.where("origem").regex(regex));
            searchCriteria.add(Criteria.where("destino").regex(regex));
            searchCriteria.add(Criteria.where("tipoCarga").regex(regex));

            // Busca no objeto que acabamos de "joina
            searchCriteria.add(Criteria.where("companyDetails.name").regex(regex));

            // Tenta buscar por números também
            try {
                double num = Double.parseDouble(search);
                searchCriteria.add(Criteria.where("peso").is(num));
                searchCriteria.add(Criteria.where("volume").is(num));
                searchCriteria.add(Criteria.where("distancia").is(num));
            } catch (NumberFormatException ignored) {}

            // Tenta buscar por ID
            if (ObjectId.isValid(search)) {
                searchCriteria.add(Criteria.where("_id").is(new ObjectId(search)));
            }

            // Adiciona a lógica de $match com $or
            pipeline.add(Aggregation.match(new Criteria().orOperator(searchCriteria)));
        }

        // 2. Executar a Contagem
        // Precisamos fazer uma contagem ANTES de paginar, para saber o total de resultados
        // Usamos o mesmo pipeline de filtros, mas adicionamos um $count no final
        List<AggregationOperation> countPipeline = new ArrayList<>(pipeline);
        countPipeline.add(Aggregation.count().as("total"));

        Aggregation countAggregation = Aggregation.newAggregation(countPipeline);

        TotalCount totalCountResult = mongoTemplate.aggregate(countAggregation, SHIPPING_COLLECTION_NAME, TotalCount.class)
                .getUniqueMappedResult();
        long total = (totalCountResult != null) ? totalCountResult.getTotal() : 0L;

        // 3. Adicionar Paginação e Projeção ao Pipeline Principal

        // Etapa 5: Ordenação (pelo _id mais novo)
        pipeline.add(Aggregation.sort(Sort.Direction.DESC, "_id"));

        // Etapa 6: Paginação
        pipeline.add(Aggregation.skip((long) (page - 1) * limit));
        pipeline.add(Aggregation.limit(limit));

        // Etapa 7: Projeção (Formatar a saída final para o DTO)
        // Isso garante que só os campos que você quer sejam retornados
        pipeline.add(Aggregation.project()
                .and("_id").as("id") // Mapeia _id -> id
                .and("companyDetails").as("company") // Mapeia o objeto do join -> company
                .and("estado").as("estado")
                .and("peso").as("peso")
                .and("volume").as("volume")
                .and("origem").as("origem")
                .and("destino").as("destino")
                .and("distancia").as("distancia")
                .and("tipoCarga").as("tipoCarga")
                .and("createdAt").as("createdAt")
                .and("updatedAt").as("updatedAt")
        );

        // 4. Executar a Query Principal
        Aggregation dataAggregation = Aggregation.newAggregation(pipeline);

        List<ShippingResponse> shippings = mongoTemplate.aggregate(dataAggregation, SHIPPING_COLLECTION_NAME, ShippingResponse.class)
                .getMappedResults();

        // 5. Retornar a Resposta Paginada
        return new PaginatedResponse<>(
                shippings,
                total,
                page,
                (int) Math.ceil((double) total / limit)
        );
    }


    // ==========================================================
    // MÉTODOS CRUD (Mantidos como estavam)
    // ==========================================================
    public Shipping createShipping(ShippingRequest request) {
        if (request.getCompany() == null || request.getEstado() == null) {
            throw new RuntimeException("Campos 'company' e 'estado' obrigatórios");
        }
        if (!companyRepository.existsById(request.getCompany())) {
            throw new RuntimeException("Empresa não encontrada");
        }
        Shipping s = new Shipping();
        s.setCompany(request.getCompany()); // salva ID como String
        s.setEstado(request.getEstado());
        s.setPeso(request.getPeso());
        s.setVolume(request.getVolume());
        s.setOrigem(request.getOrigem());
        s.setDestino(request.getDestino());
        s.setDistancia(request.getDistancia());
        s.setTipoCarga(request.getTipoCarga());
        s.setCreatedAt(Instant.now());
        s.setUpdatedAt(Instant.now());
        return shippingRepository.save(s);
    }

    public Optional<Shipping> updateShipping(String id, ShippingRequest request) {
        Optional<Shipping> opt = shippingRepository.findById(id);
        if (opt.isEmpty()) return Optional.empty();

        if (request.getCompany() != null && !companyRepository.existsById(request.getCompany())) {
            throw new RuntimeException("Empresa não encontrada");
        }

        Shipping s = opt.get();
        if(request.getCompany() != null) s.setCompany(request.getCompany());
        if(request.getEstado() != null) s.setEstado(request.getEstado());
        if(request.getPeso() != null) s.setPeso(request.getPeso());
        if(request.getVolume() != null) s.setVolume(request.getVolume());
        if(request.getOrigem() != null) s.setOrigem(request.getOrigem());
        if(request.getDestino() != null) s.setDestino(request.getDestino());
        if(request.getDistancia() != null) s.setDistancia(request.getDistancia());
        if(request.getTipoCarga() != null) s.setTipoCarga(request.getTipoCarga());
        s.setUpdatedAt(Instant.now());

        return Optional.of(shippingRepository.save(s));
    }

    public boolean deleteShipping(String id) {
        if (!shippingRepository.existsById(id)) return false;
        shippingRepository.deleteById(id);
        return true;
    }
}