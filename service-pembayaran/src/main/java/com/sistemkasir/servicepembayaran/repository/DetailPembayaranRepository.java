package com.sistemkasir.servicepembayaran.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistemkasir.servicepembayaran.model.DetailPembayaran;

public interface DetailPembayaranRepository extends JpaRepository<DetailPembayaran, UUID> {

}
