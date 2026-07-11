package com.sistemkasir.transaksi_jual.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.sistemkasir.transaksi_jual.enumeration.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransaksiResponseDTO {
    private UUID id;
    private Date createdAt;
    private String kasirEmail;
    private Status status;
    private List<DetailTransaksiResponseDTO> items;
    private BigDecimal grandTotal;
}
