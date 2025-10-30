package com.azship.fretes.controller;

import java.util.List;
import com.azship.fretes.dto.PaginatedResponse;
import com.azship.fretes.dto.ShippingRequest;
import com.azship.fretes.dto.ShippingResponse;
import com.azship.fretes.model.Shipping;
import com.azship.fretes.service.ShippingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/shipping") // Define o prefixo /api/shipping
public class ShippingController {

    private final ShippingService shippingService;

    public ShippingController(ShippingService shippingService) {
        this.shippingService = shippingService;
    }

    /**
     * Endpoint para POST /api/shipping
     * Substitui seu: app.post("/api/shipping", ...)
     */
    @PostMapping
    public ResponseEntity<?> createShipping(@RequestBody ShippingRequest request) {
        try {
            Shipping newShipping = shippingService.createShipping(request);
            // res.status(201).json({ message: "Frete criado com sucesso!", id: ... });
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of("message", "Frete criado com sucesso!", "id", newShipping.get_id()));
        } catch (RuntimeException e) {
            // Captura erros como "Empresa não encontrada" ou campos obrigatórios
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST) // 400
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Endpoint para GET /api/shipping
     * Substitui seu: app.get("/api/shipping", ...)
     */
    @GetMapping
    public ResponseEntity<PaginatedResponse<ShippingResponse>> listShippings(
            // const { page = 1, limit = 10, search = "" } = req.query as any;
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "") String search
    ) {
        try {
            PaginatedResponse<ShippingResponse> response = shippingService.listShippings(page, limit, search);
            // res.status(200).json({ data: shippings, total, ... });
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // ... res.status(500).json({ message: "Erro interno ao listar fretes." });
            // Retorna um DTO vazio em caso de erro
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new PaginatedResponse<>(List.of(), 0, page, 0));
        }
    }

    /**
     * Endpoint para PUT /api/shipping/:id
     * Substitui seu: app.put("/api/shipping/:id", ...)
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateShipping(@PathVariable String id, @RequestBody ShippingRequest request) {
        try {
            Optional<Shipping> updatedShipping = shippingService.updateShipping(id, request);

            if (updatedShipping.isPresent()) {
                // res.status(200).json({ message: "Frete atualizado com sucesso!" });
                return ResponseEntity.ok(Map.of("message", "Frete atualizado com sucesso!"));
            } else {
                // if (!frete) { return res.status(404).json(...) }
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Frete não encontrado."));
            }
        } catch (RuntimeException e) {
            // Captura erros como "Empresa não encontrada"
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Endpoint para DELETE /api/shipping/:id
     * Substitui seu: app.delete("/api/shipping/:id", ...)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShipping(@PathVariable String id) {
        boolean deleted = shippingService.deleteShipping(id);

        if (deleted) {
            // res.status(200).json({ message: "Frete excluído com sucesso!" });
            return ResponseEntity.ok(Map.of("message", "Frete excluído com sucesso!"));
        } else {
            // if (!frete) { return res.status(404).json(...) }
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Frete não encontrado."));
        }
    }
}