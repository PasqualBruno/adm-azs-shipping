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

    public PaginatedResponse<ShippingResponse> listShippings(int page, int limit, String search) {

        List<AggregationOperation> aggregationOps = new ArrayList<>();

        aggregationOps.add(context -> new org.bson.Document("$addFields",
                new org.bson.Document("company_oid",
                        new org.bson.Document("$convert",
                                new org.bson.Document("input", "$company")
                                        .append("to", "objectId")
                                        .append("onError", null)
                                        .append("onNull", null)
                        )
                )
        )));

        aggregationOps.add(Aggregation.lookup("companies", "company_oid", "_id", "companyDetails"));
        aggregationOps.add(Aggregation.unwind("companyDetails", true));
        aggregationOps.add(Aggregation.addFields().addField("company").withValue("$companyDetails").build());

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
                .and("company").as("company")
        );

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

        List<AggregationOperation> countOps = new ArrayList<>(aggregationOps);
        countOps.add(A
