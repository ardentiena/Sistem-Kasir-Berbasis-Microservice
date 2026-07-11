package com.sistemkasir.servicepembayaran.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistemkasir.servicepembayaran.model.DetailPembayaran;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DetailPembayaranRepository extends JpaRepository<DetailPembayaran, UUID>, JpaSpecificationExecutor<DetailPembayaran> {
    Optional<DetailPembayaran> findByTransaksiId(UUID transaksiId);
}
