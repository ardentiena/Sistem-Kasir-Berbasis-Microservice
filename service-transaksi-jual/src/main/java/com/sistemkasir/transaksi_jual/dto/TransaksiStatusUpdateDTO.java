package com.sistemkasir.transaksi_jual.dto;

import com.sistemkasir.transaksi_jual.enumeration.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransaksiStatusUpdateDTO {
    private Status status;
}
