package com.sistemkasir.transaksi_jual.model;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "detail_transaksi")
public class DetailTransaksi {
    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_transaksi", referencedColumnName = "id", nullable = false)
    private Transaksi transaksi;

    @Column(name = "id_produk", nullable = false)
    private UUID produkId;

    @Column(name = "nama_produk", nullable = false)
    private String namaProduk;

    @Column(name = "harga", nullable = false)
    private BigDecimal harga;

    @Column(name = "jumlah", nullable = false)
    private int jumlah;

    @Column(name = "subtotal",  nullable = false)
    private BigDecimal subtotal;
}
