package com.sistemkasir.servicepembayaran.dto;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import com.sistemkasir.servicepembayaran.enumeration.MetodeBayar;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Component
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestPembayaran {
    private MetodeBayar metodeBayar;
    private BigDecimal totalBayar;
}
