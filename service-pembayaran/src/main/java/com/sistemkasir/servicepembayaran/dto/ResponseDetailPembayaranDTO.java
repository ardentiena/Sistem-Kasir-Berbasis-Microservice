package com.sistemkasir.servicepembayaran.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.sistemkasir.servicepembayaran.enumeration.Status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDetailPembayaranDTO {
    private UUID idDetailPembayaran;
    private UUID idTransaksi;
    private BigDecimal grandTotal;
    private Status status;
    private Date createdAt;
}
