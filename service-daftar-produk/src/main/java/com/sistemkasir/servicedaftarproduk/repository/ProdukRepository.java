package com.sistemkasir.servicedaftarproduk.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistemkasir.servicedaftarproduk.model.Produk;

public interface ProdukRepository extends JpaRepository<Produk, UUID>{
    public List<Produk> findByNamaProdukContainingIgnoreCase(String namaProduk);
    boolean existsByKodeProduk(String kodeProduk);
    Optional<Produk> findByKodeProduk(String kodeProduk);
    List<Produk> findAllByKodeProdukIn(List<String> kodeProdukList);
}
