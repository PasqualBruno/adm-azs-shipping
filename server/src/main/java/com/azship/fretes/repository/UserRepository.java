// Local: src/main/java/com/azship/fretes/repository/UserRepository.java

package com.azship.fretes.repository;

import com.azship.fretes.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByUserName(String userName);
}

