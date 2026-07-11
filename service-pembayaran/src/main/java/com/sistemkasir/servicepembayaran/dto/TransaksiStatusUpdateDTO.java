package com.sistemkasir.servicepembayaran.dto;

import org.springframework.stereotype.Component;

import com.sistemkasir.servicepembayaran.enumeration.StatusUpdate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransaksiStatusUpdateDTO {
    private StatusUpdate status;
}
