package com.sistemkasir.transaksi_jual.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sistemkasir.transaksi_jual.entity.Transaksi;

public interface TransaksiRepository
        extends JpaRepository<Transaksi, UUID> {
}
