package com.sistemkasir.transaksi_jual.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PembayaranRequestDTO {
    private UUID idTransaksi;
    private BigDecimal grandTotal;
}
