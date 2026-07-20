package com.sistemkasir.servicepembayaran.controller;

import com.sistemkasir.servicepembayaran.dto.*;
import com.sistemkasir.servicepembayaran.service.PembayaranService;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/{kodeTransaksi}/paid")
    public ResponseEntity<ResponsePembayaranDTO> createPembayaran(@PathVariable String kodeTransaksi, @RequestBody RequestPembayaranDTO dto){
        return ResponseEntity.ok(pembayaranService.transaksiJualPayment(kodeTransaksi, dto));
    }

    @PostMapping("/{kodeTransaksi}/retry-callback")
    public ResponseEntity<String> retryCallback(@PathVariable String kodeTransaksi){
        pembayaranService.retryCallback(kodeTransaksi);
        return ResponseEntity.ok("success");
    }

    @GetMapping
    public ResponseEntity<List<ResponseDetailPembayaranLengkapDTO>> getAllPembayaran(){
        return ResponseEntity.ok(pembayaranService.getAllDetailPembayaran());
    }

    @GetMapping("/{kodeTransaksi}")
    public ResponseEntity<ResponseDetailPembayaranLengkapDTO> getPembayaranByKode(@PathVariable String kodeTransaksi){
        return ResponseEntity.ok(pembayaranService.getDetailPembayaranByKode(kodeTransaksi));
    }
}
