package com.sistemkasir.servicepembayaran.repository;

import com.sistemkasir.servicepembayaran.enumeration.Status;
import com.sistemkasir.servicepembayaran.model.DetailPembayaran;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;

public class DetailPembayaranSpecification {
    public static Specification<DetailPembayaran> hasStatus(Status status) {
        return (root, criteriaQuery, criteriaBuilder)
                -> criteriaBuilder.equal(root.get("status"), status);
    }
    public static Specification<DetailPembayaran> hasDate(LocalDate date) {
        Date start = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date end = Date.from(date.atTime(LocalTime.MAX).atZone(ZoneId.systemDefault()).toInstant());
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.between(root.get("createdAt"), start, end);
    }
}
