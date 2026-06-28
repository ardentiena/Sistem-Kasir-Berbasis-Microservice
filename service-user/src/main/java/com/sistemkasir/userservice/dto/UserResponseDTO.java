package com.sistemkasir.userservice.dto;

import java.util.Date;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private UUID id;
    private String role;
    private String namaDepan;
    private String namaBelakang;
    private String email;
    private boolean isActive;
    private Date createdAt;
    private Date updatedAt;
}
