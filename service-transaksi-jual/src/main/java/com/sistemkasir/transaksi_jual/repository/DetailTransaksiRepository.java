package com.sistemkasir.transaksi_jual.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sistemkasir.transaksi_jual.entity.DetailTransaksi;

public interface DetailTransaksiRepository
        extends JpaRepository<DetailTransaksi, UUID> {

    List<DetailTransaksi> findByTransaksiId(UUID transaksiId);
}
