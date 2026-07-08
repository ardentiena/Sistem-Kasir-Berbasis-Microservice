package com.sistemkasir.transaksi_jual.model;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.Data;

@Entity
@Data
public class Transaksi {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String kasirEmail;
    private double grandTotal;
    private String status;
    private Date createdAt;
    @PrePersist
    public void prePersist() {
        createdAt = new Date();
    }
}
