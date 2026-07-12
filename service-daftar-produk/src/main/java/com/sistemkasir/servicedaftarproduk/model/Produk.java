package com.sistemkasir.servicedaftarproduk.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Produk {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "nama_produk", nullable = false)
    private String namaProduk;

    @Column(name = "kategori", nullable = false)
    private String kategori;

    @Column(name = "harga", nullable = false)
    private BigDecimal harga;

    @Column(name = "stok", nullable = false)
    private int stok;

    @Column(name = "created_at", nullable = false)
    @CreatedDate
    private Date createdAt;

    @Column(name = "updated_at", nullable = true)
    @LastModifiedDate
    private Date updatedAt;
}
