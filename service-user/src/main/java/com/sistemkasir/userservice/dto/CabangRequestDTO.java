package com.sistemkasir.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CabangRequestDTO {
    @NotBlank(message = "Kode cabang wajib diisi")
    private String kodeCabang;

    @NotBlank(message = "Nama cabang wajib diisi")
    private String namaCabang;

    @NotBlank(message = "Alamat wajib diisi")
    private String alamat;
}