// Local: src/main/java/com/azship/fretes/repository/ShippingRepository.java

package com.azship.fretes.repository;

import com.azship.fretes.model.Shipping;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ShippingRepository extends MongoRepository<Shipping, String> {

}