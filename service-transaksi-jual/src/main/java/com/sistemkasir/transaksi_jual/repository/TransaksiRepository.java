package com.sistemkasir.transaksi_jual.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sistemkasir.transaksi_jual.model.Transaksi;

public interface TransaksiRepository extends JpaRepository<Transaksi, UUID> {
    List<Transaksi> findByKasirEmail(String kasirEmail);
}
