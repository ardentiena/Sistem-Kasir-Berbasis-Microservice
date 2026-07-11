package com.sistemkasir.servicepembayaran.service;

import com.sistemkasir.servicepembayaran.config.TransaksiJualClient;
import com.sistemkasir.servicepembayaran.dto.*;
import com.sistemkasir.servicepembayaran.enumeration.Status;
import com.sistemkasir.servicepembayaran.model.DetailPembayaran;
import com.sistemkasir.servicepembayaran.model.Pembayaran;
import com.sistemkasir.servicepembayaran.repository.DetailPembayaranRepository;
import com.sistemkasir.servicepembayaran.repository.PembayaranRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PembayaranService {
    private final DetailPembayaranRepository detailPembayaranRepository;
    private final PembayaranRepository pembayaranRepository;
    private final TransaksiJualClient transaksiJualClient;

    public ResponseDetailPembayaranDTO createDetailPembayaran(RequestDetailPembayaranDTO detailPembayaranDTO) {
        // cek jika response body memiliki isi
        if (detailPembayaranDTO.getIdTransaksi() == null ||
                detailPembayaranDTO.getGrandTotal() == null ||
                detailPembayaranDTO.getGrandTotal().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "format request salah!");
        }
        // buat objek detail pembayaran baru
        DetailPembayaran detailPembayaran = new DetailPembayaran();
        // insert data ke objek
        detailPembayaran.setIdTransaksi(detailPembayaranDTO.getIdTransaksi());
        detailPembayaran.setGrandTotal(detailPembayaranDTO.getGrandTotal());
        detailPembayaran.setStatus(Status.PENDING);
        // simpan ke database
        detailPembayaranRepository.save(detailPembayaran);

        // return response
        return new ResponseDetailPembayaranDTO(
                detailPembayaran.getId(),
                detailPembayaran.getIdTransaksi(),
                detailPembayaran.getGrandTotal(),
                detailPembayaran.getStatus(),
                detailPembayaran.getCreatedAt()
        );
    }

    public List<ResponseDetailPembayaranLengkapDTO> getAllDetailPembayaran() {
        List<DetailPembayaran> listDetailPembayaran = detailPembayaranRepository.findAll();

        List<ResponseDetailPembayaranLengkapDTO> listResponseDetailPembayaranLengkapDTO = new ArrayList<>();
        for(DetailPembayaran detailPembayaran : listDetailPembayaran) {
            Optional<Pembayaran> pembayaran =  pembayaranRepository.findByDetailPembayaranId(detailPembayaran.getId());
            if(pembayaran.isPresent()){
                ResponseDetailPembayaranLengkapDTO dto = getResponseDetailPembayaranLengkapDTO(detailPembayaran, pembayaran);
                listResponseDetailPembayaranLengkapDTO.add(dto);
            }else{
                ResponseDetailPembayaranLengkapDTO dto = new ResponseDetailPembayaranLengkapDTO(
                        detailPembayaran.getId(),
                        detailPembayaran.getIdTransaksi(),
                        detailPembayaran.getStatus(),
                        null,
                        detailPembayaran.getGrandTotal(),
                        null,
                        null,
                        null,
                        detailPembayaran.getCreatedAt()
                );
                listResponseDetailPembayaranLengkapDTO.add(dto);
            }
        }
        return listResponseDetailPembayaranLengkapDTO;
    }

    public ResponseDetailPembayaranLengkapDTO getDetailPembayaranById(UUID id) {
        DetailPembayaran detailPembayaran = detailPembayaranRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "detail pembayaran tidak ditemukan!"));
        Optional<Pembayaran> pembayaran = pembayaranRepository.findByDetailPembayaranId(id);
        if(pembayaran.isEmpty()){
            return new ResponseDetailPembayaranLengkapDTO(
                    detailPembayaran.getId(),
                    detailPembayaran.getIdTransaksi(),
                    detailPembayaran.getStatus(),
                    null,
                    detailPembayaran.getGrandTotal(),
                    null,
                    null,
                    null,
                    detailPembayaran.getCreatedAt()
            );
        }
        Pembayaran p = pembayaran.get();
        return new ResponseDetailPembayaranLengkapDTO(
                detailPembayaran.getId(),
                detailPembayaran.getIdTransaksi(),
                detailPembayaran.getStatus(),
                p.getMetodeBayar(),
                detailPembayaran.getGrandTotal(),
                p.getJumlahBayar(),
                p.getKembalian(),
                p.getCreatedAt(),
                detailPembayaran.getCreatedAt()
        );
    }

    public ResponsePembayaranDTO transaksiJualPayment(UUID idDetailPembayaran, RequestPembayaranDTO requestPembayaranDTO){
        if(idDetailPembayaran == null ||
                requestPembayaranDTO == null ||
                requestPembayaranDTO.getMetodeBayar() == null ||
                requestPembayaranDTO.getTotalBayar() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "format request salah!");
        }
        DetailPembayaran detailPembayaran = detailPembayaranRepository.findById(idDetailPembayaran)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "transaksi tidak ditemukan!"));
        Pembayaran pembayaran = getPembayaran(requestPembayaranDTO, detailPembayaran);
        pembayaranRepository.save(pembayaran);
        detailPembayaran.setStatus(Status.PAID);
        detailPembayaranRepository.save(detailPembayaran);
        // callback goes here
        boolean callback = transaksiJualClient.transaksiJualCallback(detailPembayaran.getIdTransaksi());

        return new ResponsePembayaranDTO(
                pembayaran.getId(),
                pembayaran.getJumlahBayar(),
                pembayaran.getKembalian(),
                detailPembayaran.getStatus(),
                callback,
                pembayaran.getCreatedAt()
        );
    }

    public boolean retryCallback(UUID idDetailPembayaran){
        DetailPembayaran detailPembayaran = detailPembayaranRepository.findById(idDetailPembayaran)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "detail tidak ditemukan!"));
        if(detailPembayaran.getStatus().equals(Status.PENDING)){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "transaksi belum terbayar!");
        }
        boolean callback = transaksiJualClient.transaksiJualCallback(detailPembayaran.getIdTransaksi());
        if(!callback){
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "callback gagal. silahkan coba lagi!");
        }
        return true;
    }

    private static @NonNull ResponseDetailPembayaranLengkapDTO getResponseDetailPembayaranLengkapDTO(DetailPembayaran detailPembayaran, Optional<Pembayaran> pembayaran) {
        Pembayaran p = pembayaran.get();
        return new ResponseDetailPembayaranLengkapDTO(
                detailPembayaran.getId(),
                detailPembayaran.getIdTransaksi(),
                detailPembayaran.getStatus(),
                p.getMetodeBayar(),
                detailPembayaran.getGrandTotal(),
                p.getJumlahBayar(),
                p.getKembalian(),
                p.getCreatedAt(),
                detailPembayaran.getCreatedAt()
        );
    }

    private static @NonNull Pembayaran getPembayaran(RequestPembayaranDTO requestPembayaranDTO, DetailPembayaran detailPembayaran) {
        if (detailPembayaran.getStatus().equals(Status.PAID)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "transaksi sudah dibayar!");
        }
        BigDecimal totalBayar = requestPembayaranDTO.getTotalBayar();
        BigDecimal grandTotal = detailPembayaran.getGrandTotal();
        if (totalBayar.compareTo(grandTotal) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "total bayar kurang!");
        }
        BigDecimal kembalian = totalBayar.subtract(grandTotal);
        Pembayaran pembayaran = new Pembayaran();
        pembayaran.setDetailPembayaran(detailPembayaran);
        pembayaran.setJumlahBayar(totalBayar);
        pembayaran.setKembalian(kembalian);
        pembayaran.setMetodeBayar(requestPembayaranDTO.getMetodeBayar());
        return pembayaran;
    }
}
