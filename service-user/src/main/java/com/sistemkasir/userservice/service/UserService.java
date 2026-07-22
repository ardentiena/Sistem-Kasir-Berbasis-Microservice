package com.sistemkasir.userservice.service;

import java.text.SimpleDateFormat;
import java.util.*;

import com.sistemkasir.userservice.dto.*;
import com.sistemkasir.userservice.model.Cabang;
import com.sistemkasir.userservice.model.User;
import com.sistemkasir.userservice.repository.CabangRepository;
import com.sistemkasir.userservice.repository.UserRepository;
import com.sistemkasir.userservice.config.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final CabangRepository cabangRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public UserResponseDTO register(RegisterUserDTO userRegister) {
        if (userRepository.findByEmail(userRegister.getEmail()).isPresent()) {
            throw new RuntimeException("Email sudah terdaftar");
        }

        Cabang cabang = null;
        if (userRegister.getKodeCabang() != null && !userRegister.getKodeCabang().isBlank()) {
            cabang = cabangRepository.findByKodeCabang(userRegister.getKodeCabang())
                    .orElseThrow(() -> new RuntimeException("Cabang tidak terdaftar"));
        }

        User newUser = new User();
        newUser.setNamaDepan(userRegister.getNamaDepan());
        newUser.setNamaBelakang(userRegister.getNamaBelakang());
        newUser.setEmail(userRegister.getEmail());
        newUser.setRole(userRegister.getRole());
        newUser.setCabang(cabang);
        newUser.setIsActive(true);
        newUser.setHarusGantiPassword(true);
        // Placeholder sementara — kolom NOT NULL, ditimpa setelah kodePegawai diketahui
        newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

        newUser = userRepository.saveAndFlush(newUser); // save #1 -> dapat nomorUrut

        String tanggal = new SimpleDateFormat("yyyyMMdd").format(new Date());
        String idPegawai;
        if ("ADMIN".equalsIgnoreCase(userRegister.getRole())) {
            idPegawai = String.format("ADM%s%04d", tanggal, newUser.getNomorUrut());
        } else {
            String kodeCabang = (cabang != null) ? cabang.getKodeCabang() : "";
            idPegawai = String.format("KSR%s%s%04d", kodeCabang, tanggal, newUser.getNomorUrut());
        }

        newUser.setKodePegawai(idPegawai);
        newUser.setPassword(passwordEncoder.encode(idPegawai)); // password awal = idPegawai
        userRepository.save(newUser); // save #2

        return mapToResponseDTO(newUser);
    }

    @Transactional
    public void gantiPassword(SetPasswordDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = findUserByEmail(email);
        if (dto.getPasswordBaru() == null || dto.getPasswordBaru().isBlank()) {
            throw new RuntimeException("Password baru tidak boleh kosong");
        }
        user.setPassword(passwordEncoder.encode(dto.getPasswordBaru()));
        user.setHarusGantiPassword(false);
        userRepository.save(user);
    }

    public String login(LoginUserDTO userLogin) {
        User user = findUserByEmail(userLogin.getEmail());
        if (!passwordEncoder.matches(userLogin.getPassword(), user.getPassword())) {
            throw new RuntimeException("Password salah");
        }
        return jwtUtil.generateToken(user);
    }

    @Transactional
    public String assignUserToCabang(AssignUserToCabangDTO assignUserToCabangDTO) {
        User user = userRepository.findByKodePegawai(assignUserToCabangDTO.getKodePegawai())
                .orElseThrow(() -> new RuntimeException("Id Pegawai tidak ditemukan"));

        String kodeCabangLama = getKodeCabangSafe(user);
        if (Objects.equals(kodeCabangLama, assignUserToCabangDTO.getKodeCabang())) {
            throw new RuntimeException("Masukkan cabang yang berbeda");
        }

        Cabang cabangBaru = cabangRepository.findByKodeCabang(assignUserToCabangDTO.getKodeCabang())
                .orElseThrow(() -> new RuntimeException("Cabang baru tidak ditemukan"));

        user.setCabang(cabangBaru);

        String tanggal = new SimpleDateFormat("yyyyMMdd").format(user.getCreatedAt() != null ? user.getCreatedAt() : new Date());

        // Update Kode Pegawai sesuai cabang baru
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            user.setKodePegawai(String.format("ADM%s%04d", tanggal, user.getNomorUrut()));
        } else {
            user.setKodePegawai(String.format("KSR%s%s%04d", cabangBaru.getKodeCabang(), tanggal, user.getNomorUrut()));
        }

        userRepository.save(user);
        return String.format("Pegawai %s ditugaskan di cabang %s", user.getKodePegawai(), cabangBaru.getNamaCabang());
    }

    public List<UserResponseDTO> getAllUser() {
        return userRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public UserResponseDTO getUserByKodePegawai(String kodePegawai) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User userId = findUserByKodePegawai(kodePegawai);
        User userEmail = findUserByEmail(email);

        if (!userEmail.getUserId().equals(userId.getUserId()) && !"ADMIN".equalsIgnoreCase(userEmail.getRole())) {
            throw new AccessDeniedException("You have no permission!");
        }

        return mapToResponseDTO(userId);
    }

    @Transactional
    public UserResponseDTO updateUser(String kodePegawai, UserRequestDTO updateUserRequest) {
        User user = findUserByKodePegawai(kodePegawai);
        user.setRole(updateUserRequest.getRole());
        user.setNamaDepan(updateUserRequest.getNamaDepan());
        user.setNamaBelakang(updateUserRequest.getNamaBelakang());
        user.setEmail(updateUserRequest.getEmail());

        userRepository.save(user);
        return mapToResponseDTO(user);
    }

    public String deleteUser(String kodePegawai) {
        User user = findUserByKodePegawai(kodePegawai);
        userRepository.delete(user);
        return "User berhasil dihapus";
    }

    private UserResponseDTO mapToResponseDTO(User user) {
        return new UserResponseDTO(
                user.getUserId(),
                user.getKodePegawai(),
                user.getRole(),
                user.getNamaDepan(),
                user.getNamaBelakang(),
                user.getEmail(),
                getKodeCabangSafe(user), // Mencegah NullPointerException
                user.getIsActive(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    private String getKodeCabangSafe(User user) {
        return (user.getCabang() != null) ? user.getCabang().getKodeCabang() : null;
    }

    private User findUserByKodePegawai(String kodePegawai) {
        return userRepository.findByKodePegawai(kodePegawai)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email tidak ditemukan"));
    }
}