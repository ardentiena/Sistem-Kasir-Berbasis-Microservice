package com.sistemkasir.servicepembayaran.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistemkasir.servicepembayaran.model.Pembayaran;
import org.springframework.stereotype.Repository;

@Repository
public interface PembayaranRepository extends JpaRepository<Pembayaran, UUID> {
    Optional<Pembayaran> findByDetailPembayaranId(UUID detailPembayaranId);
    Optional<Pembayaran> findByTransaksiId(UUID transaksiId);
}
