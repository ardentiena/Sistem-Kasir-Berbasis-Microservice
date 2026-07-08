package com.sistemkasir.servicepembayaran.dto;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Component
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestDetailPembayaran {
    private UUID idTransaksi;
    private BigDecimal grandTotal;
}
