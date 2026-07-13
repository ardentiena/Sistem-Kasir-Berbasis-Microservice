package com.sistemkasir.servicedaftarproduk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestPenguranganStokDTO {
    private List<ProdukPenguranganStokDTO> produkStockReduceRequestDTOS;
}
