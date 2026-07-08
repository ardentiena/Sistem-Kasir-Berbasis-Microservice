package com.sistemkasir.servicepembayaran.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistemkasir.servicepembayaran.model.Pembayaran;

public interface PembayaranRepository extends JpaRepository<Pembayaran, UUID> {
    Optional<Pembayaran> findByRecordPembayaranId(UUID recordPembayaranId);
}
