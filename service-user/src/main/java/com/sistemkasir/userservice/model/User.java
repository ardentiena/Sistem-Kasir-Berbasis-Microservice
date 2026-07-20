package com.sistemkasir.userservice.model;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.*;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.generator.EventType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @UuidGenerator
    private UUID userId;

    @Column(name = "kode_pegawai", unique = true)
    private String kodePegawai;

    @Column(name = "nomor_urut", unique = true, nullable = false, updatable = false,
            columnDefinition = "BIGINT AUTO_INCREMENT")
    @Generated(event = EventType.INSERT)
    private Long nomorUrut;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String namaDepan;

    @Column(nullable = false)
    private String namaBelakang;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "kodeCabang")
    private Cabang cabang;

    @Column
    private Boolean isActive;

    @Column
    @CreatedDate
    private Date createdAt;

    @Column
    @LastModifiedDate
    private Date updatedAt;
}
