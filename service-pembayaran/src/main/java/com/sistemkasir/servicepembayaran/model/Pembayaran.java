package com.sistemkasir.servicepembayaran.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.sistemkasir.servicepembayaran.enumeration.MetodeBayar;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pembayaran")
@EntityListeners(AuditingEntityListener.class)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pembayaran {
    @Column
    @Id
    @UuidGenerator
    private UUID id;

    @OneToOne
    @JoinColumn(name = "id_detail_pembayaran", referencedColumnName = "id", nullable = false)
    private DetailPembayaran detailPembayaran;

    @Column(name = "jumlah_bayar", nullable = false)
    private BigDecimal jumlahBayar;

    @Column(name = "kembalian", nullable = false)
    private BigDecimal kembalian;

    @Column(name = "metode_bayar", nullable = false)
    @Enumerated(EnumType.STRING)
    private MetodeBayar metodeBayar;

    @Column(name = "created_at", nullable = false)
    @CreatedDate
    private Date createdAt;
}
