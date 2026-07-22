package com.sistemkasir.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignUserToCabangDTO {
    private String kodePegawai;
    private String kodeCabang;
}
