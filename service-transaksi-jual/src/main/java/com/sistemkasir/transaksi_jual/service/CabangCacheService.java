package com.sistemkasir.transaksi_jual.service;

import com.sistemkasir.transaksi_jual.config.CabangClient;
import com.sistemkasir.transaksi_jual.dto.CabangResponseDTO;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CabangCacheService {
    private final CabangClient cabangClient;
    private final Map<String, String> cacheCabang = new ConcurrentHashMap<>();

    @PostConstruct
    public void initCache() {
        refreshCache();
    }

    @Scheduled(fixedRate = 300000) // tiap 5 menit
    public void refreshCache() {
        try {
            List<CabangResponseDTO> daftarCabang = cabangClient.getCabangAktif();
            Map<String, String> cacheBaru = daftarCabang.stream()
                    .collect(Collectors.toMap(CabangResponseDTO::getKodeCabang, CabangResponseDTO::getNamaCabang));
            cacheCabang.clear();
            cacheCabang.putAll(cacheBaru);
            log.info("Cache cabang berhasil diperbarui, {} cabang aktif", cacheCabang.size());
        } catch (Exception e) {
            log.warn("Gagal refresh cache cabang, tetap pakai cache lama: {}", e.getMessage());
        }
    }

    public boolean isKodeCabangValid(String kodeCabang) {
        return cacheCabang.containsKey(kodeCabang);
    }
}