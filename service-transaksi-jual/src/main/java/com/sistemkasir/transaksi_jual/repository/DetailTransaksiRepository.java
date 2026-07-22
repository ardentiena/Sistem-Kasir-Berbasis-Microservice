package com.sistemkasir.transaksi_jual.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sistemkasir.transaksi_jual.model.DetailTransaksi;
import org.springframework.stereotype.Repository;

@Repository
public interface DetailTransaksiRepository extends JpaRepository<DetailTransaksi, UUID> {
    List<DetailTransaksi> findByTransaksiId(UUID transaksiId);
}
