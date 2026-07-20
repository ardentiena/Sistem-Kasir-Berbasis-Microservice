package com.sistemkasir.transaksi_jual.config;

import com.sistemkasir.transaksi_jual.dto.CabangResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class CabangClient {
    @Qualifier("webClientUserService")
    private final WebClient webClient;

    public List<CabangResponseDTO> getCabangAktif() {
        return this.webClient.get()
                .uri("/api/cabang/aktif")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<CabangResponseDTO>>() {})
                .block();
    }
}