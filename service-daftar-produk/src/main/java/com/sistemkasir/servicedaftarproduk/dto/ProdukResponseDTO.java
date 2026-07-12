package com.sistemkasir.servicedaftarproduk.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProdukResponseDTO {
    private UUID id;
    private String namaProduk;
    private String kategori;
    private BigDecimal harga;
    private int stok;
    private Date createdAt;
    private Date updatedAt;
}
