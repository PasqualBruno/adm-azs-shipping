// Local: src/main/java/com/azship/fretes/model/Company.java

package com.azship.fretes.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "companies") // Mesmo nome da coleção no Mongoose
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    private String _id;

    private String name; // Campo obrigatório no seu POST
    private String image; // Campo obrigatório no seu POST

    // Mapeando a lógica do "?? false" e "archived: false"
    // inicializando os campos diretamente.
    private Boolean peso = false;
    private Boolean volume = false;
    private Boolean tipoCarga = false;
    private Boolean origem = false;
    private Boolean destino = false;
    private Boolean distancia = false;
    private Boolean archived = false;
}