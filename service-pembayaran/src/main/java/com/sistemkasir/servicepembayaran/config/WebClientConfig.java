package com.sistemkasir.servicepembayaran.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Value("${transaksi-jual.host}")
    private String transaksiJualHost;
    @Value("${internal.api.key}")
    private String internalApiKey;

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl(transaksiJualHost)
                .defaultHeader("Internal-API-Key", internalApiKey)
                .build();
    }
}
