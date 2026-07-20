package com.sistemkasir.servicepembayaran.dto;

import com.sistemkasir.servicepembayaran.enumeration.MetodeBayar;
import com.sistemkasir.servicepembayaran.enumeration.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDetailPembayaranLengkapDTO {
    private UUID idDetailPembayaran;
    private String kodeTransaksi;
    private Status status;
    private MetodeBayar metodeBayar;
    private BigDecimal grandTotal;
    private BigDecimal jumlahBayar;
    private BigDecimal kembalian;
    private Date tanggalPembayaran;
    private Date createdAt;
}