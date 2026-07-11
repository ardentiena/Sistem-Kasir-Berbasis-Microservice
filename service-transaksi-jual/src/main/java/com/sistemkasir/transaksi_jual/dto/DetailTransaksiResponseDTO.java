package com.sistemkasir.transaksi_jual.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetailTransaksiResponseDTO {
    private UUID id;
    private String namaProduk;
    private BigDecimal harga;
    private int jumlah;
    private BigDecimal subtotal;
}