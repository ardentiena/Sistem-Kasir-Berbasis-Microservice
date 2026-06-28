package com.sistemkasir.servicedaftarproduk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProdukRequestDTO {
    private String namaProduk;
    private String kategori;
    private double harga;
    private int stok;
}
