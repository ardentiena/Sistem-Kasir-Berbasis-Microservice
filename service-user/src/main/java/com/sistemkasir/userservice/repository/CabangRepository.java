package com.sistemkasir.userservice.repository;

import com.sistemkasir.userservice.model.Cabang;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CabangRepository extends JpaRepository<Cabang, UUID> {
    Optional<Cabang> findByKodeCabang(String kodeCabang);
    boolean existsByKodeCabang(String kodeCabang);
    List<Cabang> findByAktifTrue();
}
