
package com.azship.fretes.dto;

import com.azship.fretes.model.User;
import lombok.Data;

@Data
public class UserResponse {

    private String id;
    private String userName;
    private String name;

    public UserResponse(User user) {
        this.id = user.get_id();
        this.userName = user.getUserName();
        this.name = user.getName();
    }
}