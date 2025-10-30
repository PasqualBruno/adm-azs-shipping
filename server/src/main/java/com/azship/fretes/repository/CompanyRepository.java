package com.azship.fretes.repository;

import com.azship.fretes.model.Company;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CompanyRepository extends MongoRepository<Company, String> {
    List<Company> findAllByArchived(boolean archived);
}