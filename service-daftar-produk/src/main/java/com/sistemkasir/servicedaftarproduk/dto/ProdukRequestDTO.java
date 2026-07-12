package com.sistemkasir.servicedaftarproduk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProdukRequestDTO {
    private String namaProduk;
    private String kategori;
    private BigDecimal harga;
    private int stok;
}
