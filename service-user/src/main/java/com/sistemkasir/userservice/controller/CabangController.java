package com.sistemkasir.userservice.controller;

import com.sistemkasir.userservice.dto.CabangRequestDTO;
import com.sistemkasir.userservice.dto.CabangResponseDTO;
import com.sistemkasir.userservice.service.CabangService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cabang")
@RequiredArgsConstructor
public class CabangController {

    private final CabangService cabangService;

    @PostMapping
    public ResponseEntity<CabangResponseDTO> create(@Valid @RequestBody CabangRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cabangService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<CabangResponseDTO>> getAll() {
        return ResponseEntity.ok(cabangService.getAll());
    }

    // Endpoint khusus dipanggil service lain untuk keperluan cache
    @GetMapping("/aktif")
    public ResponseEntity<List<CabangResponseDTO>> getAllAktif() {
        return ResponseEntity.ok(cabangService.getAllAktif());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CabangResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(cabangService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CabangResponseDTO> update(@PathVariable UUID id,
                                                    @Valid @RequestBody CabangRequestDTO request) {
        return ResponseEntity.ok(cabangService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        cabangService.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}