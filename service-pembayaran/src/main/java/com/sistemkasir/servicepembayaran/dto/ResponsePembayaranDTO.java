package com.sistemkasir.servicepembayaran.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

import com.sistemkasir.servicepembayaran.enumeration.Status;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponsePembayaranDTO {
    private UUID idPembayaran;
    private BigDecimal jumlahBayar;
    private BigDecimal kembalian;
    private Status status;
    private boolean callbackBerhasil;
    private Date createdAt;
}
