package com.sistemkasir.servicepembayaran.dto;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestDetailPembayaranDTO {
    private String kodeTransaksi;
    private BigDecimal grandTotal;
}
