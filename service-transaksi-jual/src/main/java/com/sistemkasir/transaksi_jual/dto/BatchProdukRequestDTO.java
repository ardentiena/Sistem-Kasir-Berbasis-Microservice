package com.sistemkasir.transaksi_jual.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BatchProdukRequestDTO {
    private List<String> kodeProduk;
}
