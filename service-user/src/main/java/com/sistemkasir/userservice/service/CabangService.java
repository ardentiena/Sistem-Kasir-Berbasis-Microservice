package com.sistemkasir.userservice.service;

import com.sistemkasir.userservice.dto.CabangRequestDTO;
import com.sistemkasir.userservice.dto.CabangResponseDTO;
import com.sistemkasir.userservice.model.Cabang;
import com.sistemkasir.userservice.repository.CabangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CabangService {

    private final CabangRepository cabangRepository;

    public CabangResponseDTO create(CabangRequestDTO request) {
        if (cabangRepository.existsByKodeCabang(request.getKodeCabang())) {
            throw new IllegalArgumentException("Kode cabang sudah digunakan");
        }
        Cabang cabang = Cabang.builder()
                .kodeCabang(request.getKodeCabang())
                .namaCabang(request.getNamaCabang())
                .alamat(request.getAlamat())
                .aktif(true)
                .build();
        return toResponseDTO(cabangRepository.save(cabang));
    }

    public List<CabangResponseDTO> getAll() {
        return cabangRepository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<CabangResponseDTO> getAllAktif() {
        return cabangRepository.findByAktifTrue().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public CabangResponseDTO getByKodeCabang(String kodeCabang) {
        Cabang cabang = cabangRepository.findByKodeCabang(kodeCabang)
                .orElseThrow(() -> new IllegalArgumentException("Cabang tidak ditemukan"));
        return toResponseDTO(cabang);
    }

    public CabangResponseDTO update(String kodeCabang, CabangRequestDTO request) {
        Cabang cabang = cabangRepository.findByKodeCabang(kodeCabang)
                .orElseThrow(() -> new IllegalArgumentException("Cabang tidak ditemukan"));

        // Cegah kodeCabang diganti ke kode yang sudah dipakai cabang lain
        if (!cabang.getKodeCabang().equals(request.getKodeCabang())
                && cabangRepository.existsByKodeCabang(request.getKodeCabang())) {
            throw new IllegalArgumentException("Kode cabang sudah digunakan");
        }

        cabang.setKodeCabang(request.getKodeCabang());
        cabang.setNamaCabang(request.getNamaCabang());
        cabang.setAlamat(request.getAlamat());
        return toResponseDTO(cabangRepository.save(cabang));
    }

    public void softDelete(String kodeCabang) {
        Cabang cabang = cabangRepository.findByKodeCabang(kodeCabang)
                .orElseThrow(() -> new IllegalArgumentException("Cabang tidak ditemukan"));
        cabang.setAktif(false);
        cabangRepository.save(cabang);
    }

    private CabangResponseDTO toResponseDTO(Cabang cabang) {
        return CabangResponseDTO.builder()
                .id(cabang.getId())
                .kodeCabang(cabang.getKodeCabang())
                .namaCabang(cabang.getNamaCabang())
                .alamat(cabang.getAlamat())
                .aktif(cabang.isAktif())
                .createdAt(cabang.getCreatedAt())
                .build();
    }
}