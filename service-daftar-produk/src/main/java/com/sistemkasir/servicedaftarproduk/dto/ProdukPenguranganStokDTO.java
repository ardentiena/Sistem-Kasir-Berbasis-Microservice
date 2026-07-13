package com.sistemkasir.servicedaftarproduk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProdukPenguranganStokDTO {
    private UUID idProduk;
    private int jumlah;
}
