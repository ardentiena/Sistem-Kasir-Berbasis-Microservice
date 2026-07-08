package com.sistemkasir.transaksi_jual.model;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class DetailTransaksi {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private UUID transaksiId;
    private UUID produkId;
    private String namaProduk;
    private double harga;
    private int jumlah;
    private double subtotal;
}
