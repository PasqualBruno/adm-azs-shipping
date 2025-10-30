package com.azship.fretes.service;

import com.azship.fretes.dto.PaginatedResponse;
import com.azship.fretes.dto.ShippingRequest;
import com.azship.fretes.dto.ShippingResponse;
import com.azship.fretes.model.Shipping;
import com.azship.fretes.model.Company;
import com.azship.fretes.repository.CompanyRepository;
import com.azship.fretes.repository.ShippingRepository;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class ShippingService {

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

    // ==========================================================
    // Listagem com join em company e paginação
    // ==========================================================
    public PaginatedResponse<ShippingResponse> listShippings(int page, int limit, String search) {

        List<AggregationOperation> aggregationOps = new ArrayList<>();

        // 1. ADICIONE ESTA ETAPA PRIMEIRO
        aggregationOps.add(context -> new org.bson.Document("$addFields",
                new org.bson.Document("company_oid",
                        new org.bson.Document("$convert",
                                new org.bson.Document("input", "$company")
                                        .append("to", "objectId")
                                        .append("onError", null) // Se falhar a conversão, fica nulo
                                        .append("onNull", null)  // Se o campo for nulo, fica nulo
                        )
                )
        ));

        // Lookup completo da company

        aggregationOps.add(Aggregation.lookup("companies", "company_oid", "_id", "companyDetails"));
        aggregationOps.add(Aggregation.unwind("companyDetails", true)); // preserva shippings sem empresa
        aggregationOps.add(Aggregation.addFields().addField("company").withValue("$companyDetails").build());

        // Projeta os campos finais
        aggregationOps.add(Aggregation.project()
                .and("_id").as("id")
                .and("estado").as("estado")
                .and("peso").as("peso")
                .and("volume").as("volume")
                .and("origem").as("origem")
                .and("destino").as("destino")
                .and("distancia").as("distancia")
                .and("tipoCarga").as("tipoCarga")
                .and("createdAt").as("createdAt")
                .and("updatedAt").as("updatedAt")
                .and("company").as("company") // agora é objeto Company
        );

        // Filtro de busca
        if (search != null && !search.isEmpty()) {
            Pattern regex = Pattern.compile(search, Pattern.CASE_INSENSITIVE);
            List<Criteria> orFilter = new ArrayList<>();
            orFilter.add(Criteria.where("estado").regex(regex));
            orFilter.add(Criteria.where("origem").regex(regex));
            orFilter.add(Criteria.where("destino").regex(regex));
            orFilter.add(Criteria.where("tipoCarga").regex(regex));
            orFilter.add(Criteria.where("company.name").regex(regex));

            String idSearch = search;
            if (search.toUpperCase().startsWith("COD")) {
                idSearch = search.substring(3);
            }
            if (ObjectId.isValid(idSearch)) {
                orFilter.add(Criteria.where("_id").is(new ObjectId(idSearch)));
            }

            try {
                double num = Double.parseDouble(search);
                orFilter.add(Criteria.where("peso").is(num));
                orFilter.add(Criteria.where("volume").is(num));
                orFilter.add(Criteria.where("distancia").is(num));
            } catch (NumberFormatException ignored) {}

            aggregationOps.add(Aggregation.match(new Criteria().orOperator(orFilter)));
        }

        // Contagem total
        List<AggregationOperation> countOps = new ArrayList<>(aggregationOps);
        countOps.add(Aggregation.count().as("total"));
        Aggregation countAgg = Aggregation.newAggregation(countOps);
        long total = Optional.ofNullable(
                        mongoTemplate.aggregate(countAgg, "shippings", TotalCount.class)
                                .getUniqueMappedResult()
                )
                .map(TotalCount::getTotal)
                .orElse(0L);

        // Paginação
        long skip = (long) (page - 1) * limit;
        aggregationOps.add(Aggregation.sort(Sort.Direction.DESC, "createdAt"));
        aggregationOps.add(Aggregation.skip(skip));
        aggregationOps.add(Aggregation.limit(limit));
        Aggregation dataAgg = Aggregation.newAggregation(aggregationOps);

        List<ShippingResponse> shippings = mongoTemplate.aggregate(dataAgg, "shippings", ShippingResponse.class)
                .getMappedResults();

        return new PaginatedResponse<>(
                shippings,
                total,
                page,
                (int) Math.ceil((double) total / limit)
        );
    }

    private static class TotalCount {
        private long total;
        public long getTotal() { return total; }
        public void setTotal(long total) { this.total = total; }
    }

    // ==========================================================
    // CRUD Básico
    // ==========================================================
    public Shipping createShipping(ShippingRequest request) {
        if (request.getCompany() == null || request.getEstado() == null) {
            throw new RuntimeException("Campos 'company' e 'estado' obrigatórios");
        }
        if (!companyRepository.existsById(request.getCompany())) {
            throw new RuntimeException("Empresa não encontrada");
        }
        Shipping s = new Shipping();
        s.setCompany(request.getCompany()); // salva ID
        s.setEstado(request.getEstado());
        s.setPeso(request.getPeso());
        s.setVolume(request.getVolume());
        s.setOrigem(request.getOrigem());
        s.setDestino(request.getDestino());
        s.setDistancia(request.getDistancia());
        s.setTipoCarga(request.getTipoCarga());
        return shippingRepository.save(s);
    }

    public Optional<Shipping> updateShipping(String id, ShippingRequest request) {
        Optional<Shipping> opt = shippingRepository.findById(id);
        if (opt.isEmpty()) return Optional.empty();
        if (request.getCompany() != null && !companyRepository.existsById(request.getCompany())) {
            throw new RuntimeException("Empresa não encontrada");
        }
        Shipping s = opt.get();
        s.setCompany(request.getCompany());
        s.setEstado(request.getEstado());
        s.setPeso(request.getPeso());
        s.setVolume(request.getVolume());
        s.setOrigem(request.getOrigem());
        s.setDestino(request.getDestino());
        s.setDistancia(request.getDistancia());
        s.setTipoCarga(request.getTipoCarga());
        return Optional.of(shippingRepository.save(s));
    }

    public boolean deleteShipping(String id) {
        if (!shippingRepository.existsById(id)) return false;
        shippingRepository.deleteById(id);
        return true;
    }
}
