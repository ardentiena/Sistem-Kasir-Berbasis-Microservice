package com.sistemkasir.userservice.model;

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
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Column
    @Id
    @UuidGenerator
    private UUID userId;
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
    @Column
    private Boolean isActive;
    @Column
    @CreatedDate
    private Date createdAt;
    @Column
    @LastModifiedDate
    private Date updatedAt;
}
