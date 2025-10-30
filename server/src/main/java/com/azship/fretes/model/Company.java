package com.azship.fretes.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    private String _id;

    private String name;
    private String image; 

    private Boolean peso = false;
    private Boolean volume = false;
    private Boolean tipoCarga = false;
    private Boolean origem = false;
    private Boolean destino = false;
    private Boolean distancia = false;
    private Boolean archived = false;
}