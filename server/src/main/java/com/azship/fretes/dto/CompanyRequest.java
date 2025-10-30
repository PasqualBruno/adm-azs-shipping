

package com.azship.fretes.dto;

import lombok.Data;

@Data
public class CompanyRequest {


    private String name;
    private String image;

    private Boolean peso;
    private Boolean volume;
    private Boolean tipoCarga;
    private Boolean origem;
    private Boolean destino;
    private Boolean distancia;


}