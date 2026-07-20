package com.sistemkasir.userservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cabang")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cabang {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(unique = true, nullable = false)
    private String kodeCabang;

    @Column(nullable = false)
    private String namaCabang;

    @Column(nullable = false)
    private String alamat;

    @Column(nullable = false)
    @Builder.Default
    private boolean aktif = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}