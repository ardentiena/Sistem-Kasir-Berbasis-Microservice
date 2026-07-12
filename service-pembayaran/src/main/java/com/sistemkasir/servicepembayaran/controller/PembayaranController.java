package com.sistemkasir.servicepembayaran.controller;

import com.sistemkasir.servicepembayaran.dto.*;
import com.sistemkasir.servicepembayaran.service.PembayaranService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PembayaranController {
    private final PembayaranService pembayaranService;

    @PostMapping
    public ResponseEntity<ResponseDetailPembayaranDTO> createDetailPembayaran(@RequestBody RequestDetailPembayaranDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pembayaranService.createDetailPembayaran(dto));
    }

    @PostMapping("/{id}/paid")
    public ResponseEntity<ResponsePembayaranDTO> createPembayaran(@PathVariable UUID id, @RequestBody RequestPembayaranDTO dto){
        return ResponseEntity.ok(pembayaranService.transaksiJualPayment(id, dto));
    }

    @PostMapping("/{id}/retry-callback")
    public ResponseEntity<String> retryCallback(@PathVariable("id") UUID idDetailPembayaran){
        pembayaranService.retryCallback(idDetailPembayaran);
        return ResponseEntity.ok("success");
    }
    @GetMapping
    public ResponseEntity<List<ResponseDetailPembayaranLengkapDTO>> getAllPembayaran(){
        return ResponseEntity.ok(pembayaranService.getAllDetailPembayaran());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDetailPembayaranLengkapDTO> getPembayaranById(@PathVariable UUID id){
        return ResponseEntity.ok(pembayaranService.getDetailPembayaranById(id));
    }
}
