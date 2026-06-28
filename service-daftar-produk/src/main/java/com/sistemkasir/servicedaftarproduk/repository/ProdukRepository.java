package com.sistemkasir.servicedaftarproduk.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistemkasir.servicedaftarproduk.model.Produk;

public interface ProdukRepository extends JpaRepository<Produk, UUID>{
    public List<Produk> findByNamaProdukContaining(String namaProduk);
}
