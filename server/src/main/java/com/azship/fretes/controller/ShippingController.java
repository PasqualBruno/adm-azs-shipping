package com.azship.fretes.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.azship.fretes.dto.PaginatedResponse;
import com.azship.fretes.dto.ShippingRequest;
import com.azship.fretes.dto.ShippingResponse;
import com.azship.fretes.model.Shipping;
import com.azship.fretes.service.ShippingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    private final ShippingService shippingService;

    public ShippingController(ShippingService shippingService) {
        this.shippingService = shippingService;
    }

    @PostMapping
    public ResponseEntity<?> createShipping(@RequestBody ShippingRequest request) {
        try {
            Shipping newShipping = shippingService.createShipping(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of("message", "Frete criado com sucesso!", "id", newShipping.get_id()));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<ShippingResponse>> listShippings(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "") String search
    ) {
        try {
            PaginatedResponse<ShippingResponse> response = shippingService.listShippings(page, limit, search);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new PaginatedResponse<>(List.of(), 0, page, 0));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateShipping(@PathVariable String id, @RequestBody ShippingRequest request) {
        try {
            Optional<Shipping> updatedShipping = shippingService.updateShipping(id, request);

            if (updatedShipping.isPresent()) {
                return ResponseEntity.ok(Map.of("message", "Frete atualizado com sucesso!"));
            } else {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Frete não encontrado."));
            }
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShipping(@PathVariable String id) {
        boolean deleted = shippingService.deleteShipping(id);

        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Frete excluído com sucesso!"));
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Frete não encontrado."));
        }
    }
}
