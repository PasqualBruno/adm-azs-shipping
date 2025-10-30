package com.azship.fretes.dto;

import com.azship.fretes.model.EstadoFrete;
import lombok.Data;

@Data
public class ShippingRequest {


    private String company;
    private EstadoFrete estado;


    private Double peso;
    private Double volume;
    private String origem;
    private String destino;
    private Double distancia;
    private String tipoCarga;
}