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

    @GetMapping
    public ResponseEntity<List<Company>> listCompanies(
            @RequestParam(value = "archived", defaultValue = "false") boolean archived
    ) {
        boolean includeArchived = archived;
        List<Company> companies = companyService.listCompanies(includeArchived);
        return ResponseEntity.ok(companies);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable String id, @RequestBody CompanyRequest request) {
        Optional<Company> updatedCompany = companyService.updateCompany(id, request);

        if (updatedCompany.isPresent()) {
            return ResponseEntity.ok(Map.of("message", "Empresa atualizada com sucesso!"));
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Empresa não encontrada."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable String id) {
        boolean deleted = companyService.deleteCompany(id);

        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Empresa excluída com sucesso!"));
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Empresa não encontrada."));
        }
    }

    @PutMapping("/{id}/archive")
    public ResponseEntity<?> toggleArchiveCompany(@PathVariable String id) {
        Optional<Company> company = companyService.toggleCompanyArchive(id);

        if (company.isPresent()) {
            String message = company.get().getArchived() ? "Empresa arquivada" : "Empresa desarquivada";
            return ResponseEntity.ok(Map.of("message", message + " com sucesso!"));
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Empresa não encontrada."));
        }
    }
}
