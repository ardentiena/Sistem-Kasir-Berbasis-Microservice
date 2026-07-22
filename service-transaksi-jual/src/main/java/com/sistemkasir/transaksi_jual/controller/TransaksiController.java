package com.sistemkasir.transaksi_jual.controller;

import com.sistemkasir.transaksi_jual.dto.TransaksiRequestDTO;
import com.sistemkasir.transaksi_jual.dto.TransaksiResponseDTO;
import com.sistemkasir.transaksi_jual.dto.TransaksiStatusUpdateDTO;
import com.sistemkasir.transaksi_jual.service.TransaksiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransaksiController {
    private final TransaksiService transaksiService;

    @PostMapping
    public ResponseEntity<TransaksiResponseDTO> createTransaksi(@RequestBody TransaksiRequestDTO transaksiRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transaksiService.createTransaksi(transaksiRequestDTO));
    }

    @GetMapping
    public ResponseEntity<List<TransaksiResponseDTO>> getAllTransaksi() {
        return ResponseEntity.ok(transaksiService.getAllTransaksi());
    }

    @GetMapping("/{kodeTransaksi}")
    public ResponseEntity<TransaksiResponseDTO> getTransaksi(@PathVariable String kodeTransaksi) {
        return ResponseEntity.ok(transaksiService.findTransaksiByKodeTransaksi(kodeTransaksi));
    }

    @PatchMapping("/{kodeTransaksi}")
    public ResponseEntity<String> updateTransaksi(@PathVariable String kodeTransaksi, @RequestBody TransaksiStatusUpdateDTO dto) {
        transaksiService.updateStatusTransaksi(kodeTransaksi, dto);
        return ResponseEntity.ok("Status updated");
    }
}
