package com.sistemkasir.servicepembayaran.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Component
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponsePembayaran{
    private UUID idPembayaran;
    private Date waktuPembayaran;
    private BigDecimal jumlahBayar;
    private BigDecimal kembalian;
}
