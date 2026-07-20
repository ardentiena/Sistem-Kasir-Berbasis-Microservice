package com.sistemkasir.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CabangResponseDTO {
    private UUID id;
    private String kodeCabang;
    private String namaCabang;
    private String alamat;
    private boolean aktif;
    private LocalDateTime createdAt;
}
