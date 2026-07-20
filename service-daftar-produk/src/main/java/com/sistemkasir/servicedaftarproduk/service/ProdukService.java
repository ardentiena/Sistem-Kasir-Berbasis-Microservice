package com.sistemkasir.servicedaftarproduk.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.sistemkasir.servicedaftarproduk.dto.*;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import com.sistemkasir.servicedaftarproduk.model.Produk;
import com.sistemkasir.servicedaftarproduk.repository.ProdukRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProdukService {
    private final ProdukRepository produkRepository;

    public List<ProdukResponseDTO> getAllProduk(){
        List<Produk> produkList = produkRepository.findAll();
        return getProdukResponseDTOS(produkList);
    }

    public List<ProdukResponseDTO> findProdukByName(String namaProduk){
        List<Produk> produkList = produkRepository.findByNamaProdukContainingIgnoreCase(namaProduk);
        return getProdukResponseDTOS(produkList);
    }

    @NonNull
    private List<ProdukResponseDTO> getProdukResponseDTOS(List<Produk> produkList) {
        List<ProdukResponseDTO> produkResponseList = new ArrayList<>();
        for (Produk produk : produkList) {
            produkResponseList.add(toResponseDTO(produk));
        }
        return produkResponseList;
    }

    private ProdukResponseDTO toResponseDTO(Produk produk) {
        return new ProdukResponseDTO(
                produk.getId(),
                produk.getKodeProduk(),
                produk.getNamaProduk(),
                produk.getKategori(),
                produk.getHarga(),
                produk.getStok(),
                produk.getCreatedAt(),
                produk.getUpdatedAt()
        );
    }

    public ProdukResponseDTO addNewProduk(ProdukRequestDTO produkRequest){
        Produk newProduk = new Produk();
        newProduk.setNamaProduk(produkRequest.getNamaProduk());
        newProduk.setKategori(produkRequest.getKategori());
        newProduk.setHarga(produkRequest.getHarga());
        newProduk.setStok(produkRequest.getStok());

        String barcode = produkRequest.getBarcode();
        if (barcode != null && !barcode.isBlank()) {
            if (produkRepository.existsByKodeProduk(barcode)) {
                throw new RuntimeException("Barcode sudah terdaftar untuk produk lain");
            }
            newProduk.setKodeProduk(barcode);
            produkRepository.save(newProduk);
        } else {
            produkRepository.save(newProduk); // simpan dulu untuk dapat nomorUrut
            String tanggal = new SimpleDateFormat("yyyyMMdd").format(new Date());
            String kodeFallback = String.format("PRD-%s-%04d", tanggal, newProduk.getNomorUrut());
            newProduk.setKodeProduk(kodeFallback);
            produkRepository.save(newProduk);
        }

        return toResponseDTO(newProduk);
    }

    public ProdukResponseDTO updateProduk(String kodeProduk, ProdukRequestDTO updateProdukRequest){
        Optional<Produk> produk = produkRepository.findByKodeProduk(kodeProduk);
        if(produk.isEmpty()){
            throw new RuntimeException("Produk tidak ditemukan");
        }
        Produk updatedProduk = produk.get();
        updatedProduk.setNamaProduk(updateProdukRequest.getNamaProduk());
        updatedProduk.setKategori(updateProdukRequest.getKategori());
        updatedProduk.setHarga(updateProdukRequest.getHarga());
        updatedProduk.setStok(updateProdukRequest.getStok());

        produkRepository.save(updatedProduk);
        return toResponseDTO(updatedProduk);
    }

    public String deleteProduk(String kodeProduk){
        Optional<Produk> produk = produkRepository.findByKodeProduk(kodeProduk);
        if(produk.isEmpty()){
            throw new RuntimeException("Produk tidak ditemukan");
        }
        Produk existingProduk = produk.get();
        produkRepository.delete(existingProduk);
        return "Produk berhasil terhapus";
    }

    public BatchProdukResponseDTO batchProduk(BatchProdukRequestDTO batchProdukRequestDTO){
        List<String> requestKode = batchProdukRequestDTO.getKodeProduk();
        List<Produk> produkFound = produkRepository.findAllByKodeProdukIn(requestKode);

        List<String> kodeKetemu = produkFound.stream()
                .map(Produk::getKodeProduk)
                .toList();
        List<String> kodeTidakKetemu = requestKode.stream()
                .filter(k -> !kodeKetemu.contains(k))
                .toList();

        String message;
        if(kodeTidakKetemu.isEmpty())
            message = kodeKetemu.size() + "/" + requestKode.size() + " ditemukan.";
        else message = kodeKetemu.size() + "/" + requestKode.size() +
                " ditemukan." + kodeTidakKetemu.size() + " produk tidak ditemukan";

        List<ProdukResponseDTO> produkResponseDTOS = getProdukResponseDTOS(produkFound);
        return new BatchProdukResponseDTO(produkResponseDTOS, message);
    }

    public void reduceStok(RequestPenguranganStokDTO requestPenguranganStokDTO){
        List<UUID> listIdProdukPenguranganStok = requestPenguranganStokDTO.getProdukStockReduceRequestDTOS()
                .stream().map(ProdukPenguranganStokDTO::getProdukId).toList();
        List<Produk> produkList = produkRepository.findAllById(listIdProdukPenguranganStok);

        for(ProdukPenguranganStokDTO eachProduk : requestPenguranganStokDTO.getProdukStockReduceRequestDTOS()){
            Produk produk = produkList.stream()
                    .filter(p -> p.getId().equals(eachProduk.getProdukId()))
                    .findFirst()
                    .orElse(null);
            if(produk == null){
                continue;
            }else{
                produk.setStok(Math.max(0, produk.getStok() - eachProduk.getJumlah()));
            }
            produkRepository.save(produk);
        }
    }
}