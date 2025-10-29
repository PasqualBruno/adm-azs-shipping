// Local: src/main/java/com/azship/fretes/dto/UserResponse.java

package com.azship.fretes.dto;

import com.azship.fretes.model.User;
import lombok.Data;

@Data
public class UserResponse {

    private String id;
    private String userName;
    private String name;

    // Construtor que converte a entidade User para este DTO
    public UserResponse(User user) {
        this.id = user.getId();
        this.userName = user.getUserName();
        this.name = user.getName();
    }
}