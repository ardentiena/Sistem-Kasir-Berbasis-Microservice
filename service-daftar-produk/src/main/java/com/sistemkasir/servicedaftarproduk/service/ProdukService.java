package com.sistemkasir.servicedaftarproduk.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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
        List<Produk> produkList = produkRepository.findByNamaProdukContaining(namaProduk);

        return getProdukResponseDTOS(produkList);
    }

    @NonNull
    private List<ProdukResponseDTO> getProdukResponseDTOS(List<Produk> produkList) {
        List<ProdukResponseDTO> produkResponseList = new ArrayList<>();
        for (Produk produk : produkList) {
            ProdukResponseDTO productResponse = new ProdukResponseDTO(
                produk.getId(),
                produk.getNamaProduk(),
                produk.getKategori(),
                produk.getHarga(),
                produk.getStok(),
                produk.getCreatedAt(),
                produk.getUpdatedAt()
            );
            produkResponseList.add(productResponse);
        }
        return produkResponseList;
    }

    public ProdukResponseDTO addNewProduk(ProdukRequestDTO produkRequest){
        Produk newProduk = new Produk();
        return getProdukResponseDTO(produkRequest, newProduk);
    }

    @NonNull
    private ProdukResponseDTO getProdukResponseDTO(ProdukRequestDTO produkRequest, Produk newProduk) {
        newProduk.setNamaProduk(produkRequest.getNamaProduk());
        newProduk.setKategori(produkRequest.getKategori());
        newProduk.setHarga(produkRequest.getHarga());
        newProduk.setStok(produkRequest.getStok());
        produkRepository.save(newProduk);

        return new ProdukResponseDTO(
            newProduk.getId(),
            newProduk.getNamaProduk(),
            newProduk.getKategori(),
            newProduk.getHarga(),
            newProduk.getStok(),
            newProduk.getCreatedAt(),
            newProduk.getUpdatedAt()
        );
    }

    public ProdukResponseDTO updateProduk(UUID id, ProdukRequestDTO updateProdukRequest){
        Optional<Produk> produk = produkRepository.findById(id);
        if(produk.isEmpty()){
            throw new RuntimeException("Produk tidak ditemukan");
        }
        Produk updatedProduk = produk.get();
        return getProdukResponseDTO(updateProdukRequest, updatedProduk);
    }

    public String deleteProduk(UUID id){
        Optional<Produk> produk = produkRepository.findById(id);
        if(produk.isEmpty()){
            throw new RuntimeException("Produk tidak ditemukan");
        }
        Produk existingProduk = produk.get();
        produkRepository.delete(existingProduk);
        return "Produk berhasil terhapus";
    }

    public BatchProdukResponseDTO batchProduk(BatchProdukRequestDTO batchProdukRequestDTO){
        List<Produk> produkFound = produkRepository.findAllById(batchProdukRequestDTO.getIdProduk());
        List<UUID> requestIds = batchProdukRequestDTO.getIdProduk();
        List<UUID> idKetemu = produkFound.stream()
                .map(Produk::getId)
                .toList();
        List<UUID> idTidakKetemu = requestIds.stream()
                .filter(id -> !idKetemu.contains(id))
                .toList();
        String message = "";
        if(idTidakKetemu.isEmpty())
            message = idKetemu.size() + "/" + requestIds.size() + " ditemukan.";
        else message = idKetemu.size() + "/" + requestIds.size() +
                    " ditemukan." + idTidakKetemu.size() + " produk tidak ditemukan";
        List<ProdukResponseDTO> produkResponseDTOS = getProdukResponseDTOS(produkFound);
        return new BatchProdukResponseDTO(
                produkResponseDTOS,
                message
        );
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
