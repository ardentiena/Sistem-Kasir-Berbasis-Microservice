package com.sistemkasir.userservice.controller;

import com.sistemkasir.userservice.dto.AssignUserToCabangDTO;
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

    @GetMapping("/{kodeCabang}")
    public ResponseEntity<CabangResponseDTO> getById(@PathVariable String kodeCabang) {
        return ResponseEntity.ok(cabangService.getByKodeCabang(kodeCabang));
    }

    @PutMapping("/{kodeCabang}")
    public ResponseEntity<CabangResponseDTO> update(@PathVariable String kodeCabang,
                                                    @Valid @RequestBody CabangRequestDTO request) {
        return ResponseEntity.ok(cabangService.update(kodeCabang, request));
    }

    @DeleteMapping("/{kodeCabang}")
    public ResponseEntity<Void> delete(@PathVariable String kodeCabang) {
        cabangService.softDelete(kodeCabang);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pilihan")
    public ResponseEntity<List<CabangResponseDTO>> getCabangPilihan() {
        return ResponseEntity.ok(cabangService.getAllAktif());
    }
}