package com.sistemkasir.transaksi_jual.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Value("${daftar-produk.host}")
    private String daftarBarangHost;
    @Value("${pembayaran.host}")
    private String pembayaranHost;

    @Bean(name = "webClientDaftarProduk")
    public WebClient webClientDaftarProduk() {
        return WebClient.builder()
                .baseUrl(daftarBarangHost)
                .build();
    }

    @Bean(name = "webClientPembayaran")
    public WebClient webClientPembayaran() {
        return  WebClient.builder()
                .baseUrl(pembayaranHost)
                .build();
    }
}
