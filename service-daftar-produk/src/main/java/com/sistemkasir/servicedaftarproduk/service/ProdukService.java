package com.sistemkasir.servicedaftarproduk.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.sistemkasir.servicedaftarproduk.dto.ProdukRequestDTO;
import com.sistemkasir.servicedaftarproduk.dto.ProdukResponseDTO;
import com.sistemkasir.servicedaftarproduk.model.Produk;
import com.sistemkasir.servicedaftarproduk.repository.ProdukRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProdukService {
    private final ProdukRepository produkRepository;

    public List<ProdukResponseDTO> getAllProduk(){
        List<Produk> produkList = produkRepository.findAll();

        List<ProdukResponseDTO> produkResponseList = new ArrayList<>(); 
        for (Produk produk : produkList) {
            ProdukResponseDTO dto = new ProdukResponseDTO(
                produk.getId(),
                produk.getNamaProduk(),
                produk.getKategori(),
                produk.getHarga(),
                produk.getStok(),
                produk.getCreatedAt(),
                produk.getUpdatedAt()
            );
            produkResponseList.add(dto);
        }
        return produkResponseList;
    }

    public List<ProdukResponseDTO> findProdukByName(String namaProduk){
        List<Produk> produkList = produkRepository.findByNamaProdukContaining(namaProduk);

        List<ProdukResponseDTO> produkResponseList = new ArrayList<>(); 
        for (Produk produk : produkList) {
            ProdukResponseDTO dto = new ProdukResponseDTO(
                produk.getId(),
                produk.getNamaProduk(),
                produk.getKategori(),
                produk.getHarga(),
                produk.getStok(),
                produk.getCreatedAt(),
                produk.getUpdatedAt()
            );
            produkResponseList.add(dto);
        }
        return produkResponseList;
    }

    public ProdukResponseDTO addNewProduk(ProdukRequestDTO produkRequest){
        Produk newProduk = new Produk();
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
        updatedProduk.setNamaProduk(updateProdukRequest.getNamaProduk());
        updatedProduk.setKategori(updateProdukRequest.getKategori());
        updatedProduk.setHarga(updateProdukRequest.getHarga());
        updatedProduk.setStok(updateProdukRequest.getStok());
        produkRepository.save(updatedProduk);

        return new ProdukResponseDTO(
            updatedProduk.getId(),
            updatedProduk.getNamaProduk(),
            updatedProduk.getKategori(),
            updatedProduk.getHarga(),
            updatedProduk.getStok(),
            updatedProduk.getCreatedAt(),
            updatedProduk.getUpdatedAt()
        );
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
}
