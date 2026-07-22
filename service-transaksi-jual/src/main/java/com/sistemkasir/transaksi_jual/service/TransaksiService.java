package com.sistemkasir.transaksi_jual.service;

import com.sistemkasir.transaksi_jual.config.DaftarProdukClient;
import com.sistemkasir.transaksi_jual.config.PembayaranClient;
import com.sistemkasir.transaksi_jual.config.UserDetailsPrincipals;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@AllArgsConstructor
public class TransaksiService {
    private final TransaksiRepository transaksiRepository;
    private final DetailTransaksiRepository detailTransaksiRepository;
    private final DaftarProdukClient daftarProdukClient;
    private final PembayaranClient pembayaranClient;
    private final CabangCacheService cabangCacheService;

    public TransaksiResponseDTO findTransaksiByKodeTransaksi(String kodeTransaksi) {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next().getAuthority();

        Transaksi transaksi = transaksiRepository.findByKodeTransaksi(kodeTransaksi).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaksi tidak ditemukan")
        );
        if(!email.equals(transaksi.getKasirEmail()) && !Objects.equals(role, "ROLE_ADMIN")){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Id tidak valid!");
        }
        List<DetailTransaksi> listDetailTransaksi = detailTransaksiRepository.findByTransaksiId(transaksi.getId());
        List<DetailTransaksiResponseDTO> detailTransaksiResponse = getDetailTransaksiResponseDTOs(listDetailTransaksi);
        return new TransaksiResponseDTO(
                transaksi.getId(),
                transaksi.getKodeTransaksi(),
                transaksi.getIdPembayaran(),
                transaksi.getCreatedAt(),
                transaksi.getKasirEmail(),
                transaksi.getKodeCabang(),
                transaksi.getStatus(),
                detailTransaksiResponse,
                transaksi.getGrandTotal()
        );
    }

    private static @NonNull List<DetailTransaksiResponseDTO> getDetailTransaksiResponseDTOs(List<DetailTransaksi> listDetailTransaksi) {
        List<DetailTransaksiResponseDTO> detailTransaksiResponse = new ArrayList<>();
        for(DetailTransaksi detailTransaksi : listDetailTransaksi){
            DetailTransaksiResponseDTO transaksiResponseDTO = new DetailTransaksiResponseDTO(
                    detailTransaksi.getId(),
                    detailTransaksi.getKodeProduk(),
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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String role = Objects.requireNonNull(
                auth)
                .getAuthorities().iterator().next().getAuthority();
        String email = Objects.requireNonNull(auth).getName();
        String cabang = null;
        if (auth.getPrincipal() instanceof UserDetailsPrincipals userDetails) {
            cabang = userDetails.getKodeCabang();
        }

        List<Transaksi> listTransaksi;
        if(!Objects.equals(role, "ROLE_ADMIN")){
            listTransaksi = transaksiRepository.findByKasirEmail(email);
        }else if (cabang != null && !cabang.isBlank()) {
            listTransaksi = transaksiRepository.findByKodeCabang(cabang);
        }else{
            listTransaksi = transaksiRepository.findAll();
        }
        List<TransaksiResponseDTO> listTransaksiResponseDTO = new ArrayList<>();
        for(Transaksi transaksi : listTransaksi){
            List<DetailTransaksi> listDetailTransaksi = detailTransaksiRepository.findByTransaksiId(transaksi.getId());
            List<DetailTransaksiResponseDTO> listDetailTransaksiResponse = getDetailTransaksiResponseDTOs(listDetailTransaksi);
            TransaksiResponseDTO transaksiResponseDTO =  new TransaksiResponseDTO(
                    transaksi.getId(),
                    transaksi.getKodeTransaksi(),
                    transaksi.getIdPembayaran(),
                    transaksi.getCreatedAt(),
                    transaksi.getKasirEmail(),
                    transaksi.getKodeCabang(),
                    transaksi.getStatus(),
                    listDetailTransaksiResponse,
                    transaksi.getGrandTotal()
            );
            listTransaksiResponseDTO.add(transaksiResponseDTO);
        }
        return listTransaksiResponseDTO;
    }

    public void updateStatusTransaksi(String kodeTransaksi, TransaksiStatusUpdateDTO updateStatusDTO){
        Transaksi transaksi = transaksiRepository.findByKodeTransaksi(kodeTransaksi).orElseThrow(
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

        // Validasi kodeCabang dari cache lokal — fail fast sebelum panggil service lain
        String kodeCabang = transaksiRequestDTO.getKodeCabang();
        if (kodeCabang == null || kodeCabang.isBlank() || !cabangCacheService.isKodeCabangValid(kodeCabang)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kode cabang tidak valid atau tidak ditemukan");
        }

        List<String> listRequestKodeProduk = transaksiRequestDTO.getProdukList()
                .stream().map(ProdukRequestDTO::getKodeProduk).toList();

        BatchProdukRequestDTO batchProdukRequestDTO = new BatchProdukRequestDTO();
        batchProdukRequestDTO.setKodeProduk(listRequestKodeProduk);

        BatchProdukResponseDTO daftarProduk = daftarProdukClient.getBatchDaftarProduk(batchProdukRequestDTO);

        if (daftarProduk.getProduk().size() != listRequestKodeProduk.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, daftarProduk.getMessage());
        }

        BigDecimal grandTotal = BigDecimal.ZERO;
        List<DetailTransaksi> listDetailTransaksi = new ArrayList<>();

        for (ProdukRequestDTO eachProduk : transaksiRequestDTO.getProdukList()) {
            ProdukResponseDTO produk = daftarProduk.getProduk().stream()
                    .filter(p -> p.getKodeProduk().equals(eachProduk.getKodeProduk()))
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produk tidak ditemukan"));

            BigDecimal subtotalItem = produk.getHarga().multiply(BigDecimal.valueOf(eachProduk.getJumlah()));
            grandTotal = grandTotal.add(subtotalItem);

            DetailTransaksi detailTransaksi = new DetailTransaksi();
            detailTransaksi.setKodeProduk(eachProduk.getKodeProduk());
            detailTransaksi.setNamaProduk(produk.getNamaProduk());
            detailTransaksi.setHarga(produk.getHarga());
            detailTransaksi.setJumlah(eachProduk.getJumlah());
            detailTransaksi.setSubtotal(subtotalItem);
            listDetailTransaksi.add(detailTransaksi);
        }

        UUID transaksiId = UUID.randomUUID();

        Transaksi transaksi = new Transaksi();
        transaksi.setId(transaksiId);
        transaksi.setKodeCabang(kodeCabang);
        transaksi.setKasirEmail(kasirEmail);
        transaksi.setGrandTotal(grandTotal);
        transaksi.setStatus(Status.PENDING);
        transaksi = transaksiRepository.save(transaksi); // save #1 -> dapat nomorUrut

        String tanggal = new SimpleDateFormat("yyyyMMdd").format(new Date());
        String kodeTransaksi = String.format("TRX-%s-%s-%04d", kodeCabang, tanggal, transaksi.getNomorUrut());
        transaksi.setKodeTransaksi(kodeTransaksi);
        transaksi = transaksiRepository.save(transaksi); // save #2 -> kodeTransaksi terisi

        PembayaranRequestDTO requestPembayaran = new PembayaranRequestDTO(kodeTransaksi, grandTotal);
        ResponseDetailPembayaranDTO responsePembayaran = pembayaranClient.buatPembayaran(requestPembayaran);

        List<ProdukRequestDTO> itemReduced = listDetailTransaksi.stream()
                .map(d -> new ProdukRequestDTO(d.getKodeProduk(), d.getJumlah()))
                .toList();
        RequestPenguranganStokDTO penguranganStok = new RequestPenguranganStokDTO(itemReduced);
        try{
            daftarProdukClient.reduceStok(penguranganStok);
        }catch(Exception e){
            System.out.println("DEBUG - Gagal kurangi stok (best effort, transaksi tetap lanjut): " + e.getMessage());
        }

        transaksi.setIdPembayaran(responsePembayaran.getIdDetailPembayaran());
        transaksi = transaksiRepository.save(transaksi); // save #3 -> idPembayaran terisi

        for (DetailTransaksi detailTransaksi : listDetailTransaksi) {
            detailTransaksi.setTransaksi(transaksi);
            detailTransaksiRepository.save(detailTransaksi);
        }

        List<DetailTransaksiResponseDTO> detailResponse = getDetailTransaksiResponseDTOs(listDetailTransaksi);
        return new TransaksiResponseDTO(
                transaksi.getId(),
                transaksi.getKodeTransaksi(),
                transaksi.getIdPembayaran(),
                transaksi.getCreatedAt(),
                transaksi.getKasirEmail(),
                transaksi.getKodeCabang(),
                transaksi.getStatus(),
                detailResponse, transaksi.getGrandTotal()
        );
    }
}
