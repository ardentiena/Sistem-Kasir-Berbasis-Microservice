package com.sistemkasir.transaksi_jual.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDetailPembayaranDTO {
    private UUID idPembayaran;
}
