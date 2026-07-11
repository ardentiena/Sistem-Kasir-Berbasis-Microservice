package com.sistemkasir.transaksi_jual.service;

import com.sistemkasir.transaksi_jual.dto.DetailTransaksiResponseDTO;
import com.sistemkasir.transaksi_jual.dto.TransaksiResponseDTO;
import com.sistemkasir.transaksi_jual.model.DetailTransaksi;
import com.sistemkasir.transaksi_jual.model.Transaksi;
import com.sistemkasir.transaksi_jual.repository.DetailTransaksiRepository;
import com.sistemkasir.transaksi_jual.repository.TransaksiRepository;
import lombok.AllArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
@AllArgsConstructor
public class TransaksiService {
    private final TransaksiRepository transaksiRepository;
    private final DetailTransaksiRepository detailTransaksiRepository;

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
}
