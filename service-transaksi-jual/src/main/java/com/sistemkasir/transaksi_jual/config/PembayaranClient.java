package com.sistemkasir.transaksi_jual.config;

import com.sistemkasir.transaksi_jual.dto.PembayaranRequestDTO;
import com.sistemkasir.transaksi_jual.dto.ResponseDetailPembayaranDTO;
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
public class PembayaranClient {
    @Qualifier("webClientPembayaran")
    public final WebClient webClient;

    public ResponseDetailPembayaranDTO buatPembayaran(PembayaranRequestDTO requestPembayaran) {
        ResponseDetailPembayaranDTO responseDetailPembayaran;
        try{
            responseDetailPembayaran = this.webClient.post()
                    .uri("/api/payment")
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(requestPembayaran)
                    .retrieve()
                    .bodyToMono(ResponseDetailPembayaranDTO.class)
                    .block();
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Service unavailable");
        }
        return responseDetailPembayaran;
    }
}
