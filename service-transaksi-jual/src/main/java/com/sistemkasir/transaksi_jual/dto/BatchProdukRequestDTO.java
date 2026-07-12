package com.sistemkasir.transaksi_jual.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BatchProdukRequestDTO {
    private List<UUID> produkIds;
}
