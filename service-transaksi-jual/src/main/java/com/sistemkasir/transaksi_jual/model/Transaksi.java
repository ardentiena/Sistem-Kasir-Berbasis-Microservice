package com.sistemkasir.transaksi_jual.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.sistemkasir.transaksi_jual.enumeration.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "transaksi")
@EntityListeners(AuditingEntityListener.class)
public class Transaksi {
    @Id
    private UUID id;

    @Column(name = "kasir",  nullable = false)
    private String kasirEmail;

    @OneToMany(mappedBy = "transaksi")
    private List<DetailTransaksi> detailTransaksi;

    @Column(name = "grand_total", nullable = false)
    private BigDecimal grandTotal;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "id_pembayaran", nullable = false)
    private UUID idPembayaran;

    @Column(name = "created_at",  nullable = false)
    @CreatedDate
    private Date createdAt;
}
