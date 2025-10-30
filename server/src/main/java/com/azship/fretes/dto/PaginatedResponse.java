// Local: src/main/java/com/azship/fretes/dto/PaginatedResponse.java

package com.azship.fretes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedResponse<T> {

    private List<T> data;
    private long total;
    private int page;
    private int totalPages;
}