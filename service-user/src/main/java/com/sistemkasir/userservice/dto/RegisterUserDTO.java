package com.sistemkasir.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUserDTO {
    private String role;
    private String namaDepan;
    private String namaBelakang;
    private String email;
    private String kodeCabang;
}