package com.sistemkasir.servicedaftarproduk.controller;

import java.util.List;
import java.util.UUID;

import com.sistemkasir.servicedaftarproduk.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sistemkasir.servicedaftarproduk.service.ProdukService;

import lombok.AllArgsConstructor;


@RestController
@RequestMapping("/api/products")
@AllArgsConstructor
public class ProdukController {
    private final ProdukService produkService;

    @GetMapping
    public ResponseEntity<List<ProdukResponseDTO>> getAllProduk(){
        return ResponseEntity.ok(produkService.getAllProduk());
    }

    @GetMapping("/find")
    public ResponseEntity<List<ProdukResponseDTO>> getProdukByName(@RequestParam String namaProduk){
        return ResponseEntity.ok(produkService.findProdukByName(namaProduk));
    }

    @PostMapping
    public ResponseEntity<ProdukResponseDTO> createNewProduk(@RequestBody ProdukRequestDTO produkRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(produkService.addNewProduk(produkRequest));
    }

    @PutMapping("/{kodeProduk}")
    public ResponseEntity<ProdukResponseDTO> updateProduk(@PathVariable String kodeProduk, @RequestBody ProdukRequestDTO productRequest) {
        return ResponseEntity.ok(produkService.updateProduk(kodeProduk, productRequest));
    }

    @DeleteMapping("/{kodeProduk}")
    public ResponseEntity<String> deleteProduk(@PathVariable String kodeProduk){
        return ResponseEntity.status(HttpStatus.OK).body(produkService.deleteProduk(kodeProduk));
    }

    @PostMapping("/batch")
    public ResponseEntity<BatchProdukResponseDTO> getBatchProduk(@RequestBody BatchProdukRequestDTO batchProdukRequestDTO){
        return ResponseEntity.ok(produkService.batchProduk(batchProdukRequestDTO));
    }

    @PatchMapping("/reduce-stock")
    public void reduceStokProduk(@RequestBody RequestPenguranganStokDTO requestPenguranganStokDTO){
        produkService.reduceStok(requestPenguranganStokDTO);
    }
}
