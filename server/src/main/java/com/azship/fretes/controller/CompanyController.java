// Local: src/main/java/com/azship/fretes/controller/CompanyController.java

package com.azship.fretes.controller;

import com.azship.fretes.dto.CompanyRequest;
import com.azship.fretes.model.Company;
import com.azship.fretes.service.CompanyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }


    @PostMapping
    public ResponseEntity<?> createCompany(@RequestBody CompanyRequest request) {

        if (request.getName() == null || request.getImage() == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Os campos 'name' e 'image' são obrigatórios."));
        }

        try {
            Company newCompany = companyService.createCompany(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of("message", "Empresa criada com sucesso!", "id", newCompany.get_id()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro interno ao criar empresa."));
        }
    }

    /**
     * Endpoint para GET /api/companies
     * Substitui seu: app.get("/api/companies", ...)
     */
    @GetMapping
    public ResponseEntity<List<Company>> listCompanies(
            // No seu Node: const { archived } = req.query;
            // O Spring mapeia o ?archived=true para este parâmetro
            @RequestParam(value = "archived", defaultValue = "false") boolean archived
    ) {
        // No seu Node: if (archived === "false") { filter.archived = { $ne: true }; }
        // Nossa lógica no serviço é: listCompanies(true) -> traz todas
        // listCompanies(false) -> traz só as não arquivadas (que é o seu filtro)
        boolean includeArchived = archived; // Se ?archived=true, inclui

        List<Company> companies = companyService.listCompanies(includeArchived);
        return ResponseEntity.ok(companies);
    }

    /**
     * Endpoint para PUT /api/companies/:id
     * Substitui seu: app.put("/api/companies/:id", ...)
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable String id, @RequestBody CompanyRequest request) {
        Optional<Company> updatedCompany = companyService.updateCompany(id, request);

        if (updatedCompany.isPresent()) {
            // res.status(200).json({ message: "Empresa atualizada com sucesso!" });
            return ResponseEntity.ok(Map.of("message", "Empresa atualizada com sucesso!"));
        } else {
            // if (!empresa) { return res.status(404).json(...) }
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Empresa não encontrada."));
        }
    }

    /**
     * Endpoint para DELETE /api/companies/:id
     * Substitui seu: app.delete("/api/companies/:id", ...)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable String id) {
        boolean deleted = companyService.deleteCompany(id);

        if (deleted) {
            // res.status(200).json({ message: "Empresa excluída com sucesso!" });
            return ResponseEntity.ok(Map.of("message", "Empresa excluída com sucesso!"));
        } else {
            // if (!empresa) { return res.status(404).json(...) }
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Empresa não encontrada."));
        }
    }

    /**
     * Endpoint para PUT /api/companies/:id/archive
     * Substitui seu: app.put("/api/companies/:id/archive", ...)
     */
    @PutMapping("/{id}/archive")
    public ResponseEntity<?> toggleArchiveCompany(@PathVariable String id) {
        Optional<Company> company = companyService.toggleCompanyArchive(id);

        if (company.isPresent()) {
            String message = company.get().getArchived() ? "Empresa arquivada" : "Empresa desarquivada";
            // res.status(200).json({ message: `Empresa ${...} com sucesso!` });
            return ResponseEntity.ok(Map.of("message", message + " com sucesso!"));
        } else {
            // if (!empresa) { return res.status(404).json(...) }
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Empresa não encontrada."));
        }
    }
}