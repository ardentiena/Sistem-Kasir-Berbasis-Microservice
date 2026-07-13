package com.sistemkasir.transaksi_jual.service;

import com.sistemkasir.transaksi_jual.config.DaftarProdukClient;
import com.sistemkasir.transaksi_jual.config.PembayaranClient;
import com.sistemkasir.transaksi_jual.dto.*;
import com.sistemkasir.transaksi_jual.enumeration.Status;
import com.sistemkasir.transaksi_jual.model.DetailTransaksi;
import com.sistemkasir.transaksi_jual.model.Transaksi;
import com.sistemkasir.transaksi_jual.repository.DetailTransaksiRepository;
import com.sistemkasir.transaksi_jual.repository.TransaksiRepository;
import lombok.AllArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.*;

@Service
@AllArgsConstructor
public class TransaksiService {
    private final TransaksiRepository transaksiRepository;
    private final DetailTransaksiRepository detailTransaksiRepository;
    private final DaftarProdukClient daftarProdukClient;
    private final PembayaranClient pembayaranClient;

    public TransaksiResponseDTO findTransaksiById(UUID id){
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next().getAuthority();

        Transaksi transaksi = transaksiRepository.findById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaksi tidak ditemukan")
        );
        if(!email.equals(transaksi.getKasirEmail()) && !Objects.equals(role, "ROLE_ADMIN")){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Id tidak valid!");
        }
        List<DetailTransaksi> listDetailTransaksi = detailTransaksiRepository.findByTransaksiId(transaksi.getId());
        List<DetailTransaksiResponseDTO> detailTransaksiResponse = getDetailTransaksiResponseDTOs(listDetailTransaksi);
        return new TransaksiResponseDTO(
                transaksi.getId(),
                transaksi.getIdPembayaran(),
                transaksi.getCreatedAt(),
                transaksi.getKasirEmail(),
                transaksi.getStatus(),
                detailTransaksiResponse,
                transaksi.getGrandTotal()
        );
    }

    private static @NonNull List<DetailTransaksiResponseDTO> getDetailTransaksiResponseDTOs(List<DetailTransaksi> listDetailTransaksi) {
        List<DetailTransaksiResponseDTO> detailTransaksiResponse = new ArrayList<>();
        for(DetailTransaksi detailTransaksi : listDetailTransaksi){
            DetailTransaksiResponseDTO transaksiResponseDTO = new DetailTransaksiResponseDTO(
                    detailTransaksi.getProdukId(),
                    detailTransaksi.getNamaProduk(),
                    detailTransaksi.getHarga(),
                    detailTransaksi.getJumlah(),
                    detailTransaksi.getSubtotal()
            );
            detailTransaksiResponse.add(transaksiResponseDTO);
        }
        return detailTransaksiResponse;
    }

    public List<TransaksiResponseDTO> getAllTransaksi(){
        String role = Objects.requireNonNull(
                SecurityContextHolder.getContext().getAuthentication())
                .getAuthorities().iterator().next().getAuthority();
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        List<Transaksi> listTransaksi;
        if(!Objects.equals(role, "ROLE_ADMIN")){
            listTransaksi = transaksiRepository.findByKasirEmail(email);
        }else{
            listTransaksi = transaksiRepository.findAll();
        }
        List<TransaksiResponseDTO> listTransaksiResponseDTO = new ArrayList<>();
        for(Transaksi transaksi : listTransaksi){
            List<DetailTransaksi> listDetailTransaksi = detailTransaksiRepository.findByTransaksiId(transaksi.getId());
            List<DetailTransaksiResponseDTO> listDetailTransaksiResponse = getDetailTransaksiResponseDTOs(listDetailTransaksi);
            TransaksiResponseDTO transaksiResponseDTO =  new TransaksiResponseDTO(
                    transaksi.getId(),
                    transaksi.getIdPembayaran(),
                    transaksi.getCreatedAt(),
                    transaksi.getKasirEmail(),
                    transaksi.getStatus(),
                    listDetailTransaksiResponse,
                    transaksi.getGrandTotal()
            );
            listTransaksiResponseDTO.add(transaksiResponseDTO);
        }
        return listTransaksiResponseDTO;
    }

    public void updateStatusTransaksi(UUID id, TransaksiStatusUpdateDTO updateStatusDTO){
        Transaksi transaksi = transaksiRepository.findById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaksi tidak ditemukan")
        );
        if(!updateStatusDTO.getStatus().equals(Status.SELESAI)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        }
        if(transaksi.getStatus().equals(Status.SELESAI)){return;}
        transaksi.setStatus(Status.SELESAI);
        transaksiRepository.save(transaksi);
    }

    public TransaksiResponseDTO createTransaksi(TransaksiRequestDTO transaksiRequestDTO){
        String kasirEmail = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        List<UUID> listRequestIdProduk = transaksiRequestDTO.getProdukList()
                .stream().map(ProdukRequestDTO::getProdukId).toList();

        BatchProdukRequestDTO batchProdukRequestDTO = new BatchProdukRequestDTO();
        batchProdukRequestDTO.setIdProduk(listRequestIdProduk);

        BatchProdukResponseDTO daftarProduk = daftarProdukClient.getBatchDaftarProduk(batchProdukRequestDTO);

        if (daftarProduk.getProduk().size() != listRequestIdProduk.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, daftarProduk.getMessage());
        }

        BigDecimal grandTotal = BigDecimal.ZERO;
        List<DetailTransaksi> listDetailTransaksi = new ArrayList<>();

        for (ProdukRequestDTO eachProduk : transaksiRequestDTO.getProdukList()) {
            ProdukResponseDTO produk = daftarProduk.getProduk().stream()
                    .filter(p -> p.getId().equals(eachProduk.getProdukId()))
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produk tidak ditemukan"));

            BigDecimal subtotalItem = produk.getHarga().multiply(BigDecimal.valueOf(eachProduk.getJumlah()));
            grandTotal = grandTotal.add(subtotalItem);

            DetailTransaksi detailTransaksi = new DetailTransaksi();
            detailTransaksi.setProdukId(eachProduk.getProdukId());
            detailTransaksi.setNamaProduk(produk.getNamaProduk());
            detailTransaksi.setHarga(produk.getHarga());
            detailTransaksi.setJumlah(eachProduk.getJumlah());
            detailTransaksi.setSubtotal(subtotalItem);
            listDetailTransaksi.add(detailTransaksi);
        }

        UUID transaksiId = UUID.randomUUID();

        PembayaranRequestDTO requestPembayaran = new PembayaranRequestDTO(transaksiId, grandTotal);
        ResponseDetailPembayaranDTO responsePembayaran = pembayaranClient.buatPembayaran(requestPembayaran);
        System.out.println("DEBUG - responsePembayaran.getId(): " + responsePembayaran.getIdDetailPembayaran());

        RequestPenguranganStokDTO penguranganStok = new RequestPenguranganStokDTO(transaksiRequestDTO.getProdukList());
        daftarProdukClient.reduceStok(penguranganStok);

        Transaksi transaksi = new Transaksi();
        transaksi.setId(transaksiId);
        transaksi.setKasirEmail(kasirEmail);
        transaksi.setGrandTotal(grandTotal);
        transaksi.setStatus(Status.PENDING);
        transaksi.setIdPembayaran(responsePembayaran.getIdDetailPembayaran());
        transaksi = transaksiRepository.save(transaksi);

        for (DetailTransaksi detailTransaksi : listDetailTransaksi) {
            detailTransaksi.setTransaksi(transaksi);
            detailTransaksiRepository.save(detailTransaksi);
        }

        List<DetailTransaksiResponseDTO> detailResponse = getDetailTransaksiResponseDTOs(listDetailTransaksi);
        return new TransaksiResponseDTO(
                transaksi.getId(),
                transaksi.getIdPembayaran(),
                transaksi.getCreatedAt(),
                transaksi.getKasirEmail(),
                transaksi.getStatus(),
                detailResponse,
                transaksi.getGrandTotal()
        );
    }
}
