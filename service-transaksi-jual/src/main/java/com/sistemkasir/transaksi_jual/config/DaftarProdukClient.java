package com.sistemkasir.transaksi_jual.config;

import com.sistemkasir.transaksi_jual.dto.BatchProdukRequestDTO;
import com.sistemkasir.transaksi_jual.dto.BatchProdukResponseDTO;
import com.sistemkasir.transaksi_jual.dto.RequestPenguranganStokDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

@Component
@Slf4j
@Data
@RequiredArgsConstructor
public class DaftarProdukClient {
    @Qualifier("webClientDaftarProduk")
    private final WebClient webClient;

    public BatchProdukResponseDTO getBatchDaftarProduk(BatchProdukRequestDTO batchProdukRequestDTO) {
        BatchProdukResponseDTO responseDTO;
        try{
             responseDTO = this.webClient.post()
                    .uri("/api/products/batch")
                     .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(batchProdukRequestDTO)
                    .retrieve()
                    .bodyToMono(BatchProdukResponseDTO.class)
                    .block();
        }catch(Exception e){
            System.out.println("DEBUG - Error calling service: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, e.getMessage());
        }
        return responseDTO;
    }

    public void reduceStok(RequestPenguranganStokDTO requestPenguranganStokDTO) {
        try {
            this.webClient.patch()
                    .uri("/api/products/reduce-stock")
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(requestPenguranganStokDTO)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        }catch (Exception e){
            System.out.println("DEBUG - Error calling service: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, e.getMessage());
        }
    }
}
