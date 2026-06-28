package com.sistemkasir.servicedaftarproduk.model;

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
    @Column
    @Id
    @UuidGenerator
    private UUID id;
    @Column(nullable = false)
    private String namaProduk;
    @Column(nullable = false)
    private String kategori;
    @Column(nullable = false)
    private double harga;
    @Column(nullable = false)
    private int stok;
    @Column
    @CreatedDate
    private Date createdAt;
    @Column
    @LastModifiedDate
    private Date updatedAt;
}
