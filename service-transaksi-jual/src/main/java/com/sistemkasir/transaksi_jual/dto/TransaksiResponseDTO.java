package com.sistemkasir.transaksi_jual.dto;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransaksiResponseDTO {
    private UUID id;
    private String kasirEmail;
    private double grandTotal;
    private String status;
    private Date createdAt;
    private List<DetailTransaksiResponseDTO> items;
}
