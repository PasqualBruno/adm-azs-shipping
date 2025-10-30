package com.azship.fretes.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "shippings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shipping {

    @Id
    private String _id;

    // Armazenamos o _id da company como String
    private String company;

    private EstadoFrete estado = EstadoFrete.PENDENTE;
    private Double peso;
    private Double volume;
    private String origem;
    private String destino;
    private Double distancia;
    private String tipoCarga;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
