package com.sistemkasir.servicepembayaran.config;

import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.sistemkasir.servicepembayaran.dto.TransaksiStatusUpdateDTO;
import com.sistemkasir.servicepembayaran.enumeration.StatusUpdate;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@Data
@RequiredArgsConstructor
public class TransaksiJualClient {
    private final WebClient webClient;

    public boolean transaksiJualCallback(UUID transaksiId) {
        // 1. build DTO dengan status "SELESAI"
        TransaksiStatusUpdateDTO dto = new TransaksiStatusUpdateDTO(StatusUpdate.SELESAI);
        // 2. build request PATCH ke transaksiJualHost + "/api/transactions/" + idTransaksi
        try{
            this.webClient.patch()
                    .uri("/api/transactions/{id}", transaksiId)
                    .bodyValue(dto)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        } catch (Exception e) {
            // Log error
            log.error("Error saat melakukan callback ke transaksi jual: {}", e.getMessage());
            return false;
        }
        return true;
    }
}
