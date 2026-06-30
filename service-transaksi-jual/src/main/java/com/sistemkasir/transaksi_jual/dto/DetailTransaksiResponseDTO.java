package com.sistemkasir.transaksi_jual.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetailTransaksiResponseDTO {
    private UUID produkId;
    private String namaProduk;
    private double harga;
    private int jumlah;
    private double subtotal;
}
