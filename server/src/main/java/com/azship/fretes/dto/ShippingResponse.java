package com.azship.fretes.dto;

import com.azship.fretes.model.Company;
import com.azship.fretes.model.EstadoFrete;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingResponse {

    private String _id;
    private Company company; // Agora é o objeto completo
    private EstadoFrete estado;
    private Double peso;
    private Double volume;
    private String origem;
    private String destino;
    private Double distancia;
    private String tipoCarga;
    private Instant createdAt;
    private Instant updatedAt;
}
