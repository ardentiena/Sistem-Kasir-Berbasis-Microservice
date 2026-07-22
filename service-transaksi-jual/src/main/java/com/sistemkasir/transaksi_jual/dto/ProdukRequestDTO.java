package com.sistemkasir.transaksi_jual.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProdukRequestDTO {
    private String kodeProduk;
    private int jumlah;
}
