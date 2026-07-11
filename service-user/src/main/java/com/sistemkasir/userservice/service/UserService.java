package com.sistemkasir.userservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.sistemkasir.userservice.config.JwtUtil;
import com.sistemkasir.userservice.dto.LoginUserDTO;
import com.sistemkasir.userservice.dto.RegisterUserDTO;
import com.sistemkasir.userservice.dto.UserRequestDTO;
import com.sistemkasir.userservice.dto.UserResponseDTO;
import com.sistemkasir.userservice.model.User;
import com.sistemkasir.userservice.repository.UserRepository;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserResponseDTO register(RegisterUserDTO userRegister){
       // cari user berdasarkan email dan simpan ke registerEmail
       // Optional itu untuk jaga-jaga kalau datanya tidak ada
        Optional<User> registerEmail = userRepository.findByEmail(userRegister.getEmail());
        if(registerEmail.isPresent()){
            throw new RuntimeException("Email sudah terdaftar");
        }
        // buat objek user baru
        User newUser = new User();
        // isi data dari parameter ke objek baru ini
        newUser.setNamaDepan(userRegister.getNamaDepan());
        newUser.setNamaBelakang(userRegister.getNamaBelakang());
        newUser.setEmail(userRegister.getEmail());
        newUser.setPassword(passwordEncoder.encode(userRegister.getPassword()));
        newUser.setRole(userRegister.getRole());
        newUser.setIsActive(true);
        // simpan ke database
        userRepository.save(newUser);

        return new UserResponseDTO(
            newUser.getUserId(),
            newUser.getRole(), 
            newUser.getNamaDepan(), 
            newUser.getNamaBelakang(), 
            newUser.getEmail(),
            newUser.getIsActive(),
            newUser.getCreatedAt(),
            newUser.getUpdatedAt()
        );
    }

    public String login(LoginUserDTO userLogin){
        User user = findUserByEmail(userLogin.getEmail());
        // cek jika password sama dengan di database
        if(!passwordEncoder.matches(userLogin.getPassword(), user.getPassword())){
            throw new RuntimeException("Password salah");
        }
        // return jwt key yang digenerate
        return jwtUtil.generateToken(user);
    }

    public List<UserResponseDTO> getAllUser(){
        // ambil semua data user dan masukkan ke List<User>
        List<User> userList = userRepository.findAll();
        // siapkan array untuk list response
        List<UserResponseDTO> userResponseList = new ArrayList<>();
        // loop semua User di userList
        for(User user : userList){
            // buat response setiap user
            UserResponseDTO userResponse = new UserResponseDTO(
                user.getUserId(),
                user.getRole(),
                user.getNamaDepan(),
                user.getNamaBelakang(),
                user.getEmail(),
                user.getIsActive(),
                user.getCreatedAt(),
                user.getUpdatedAt()
            );
            // masukkan response ke response list
            userResponseList.add(userResponse);
        }
        return userResponseList;
    }

    public UserResponseDTO getUserById(UUID id){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // cari user berdasarkan id dan simpan ke userId
        User userId = findUserById(id);
        User userEmail = findUserByEmail(email);    
        if(!userEmail.getUserId().equals(userId.getUserId()) && !userEmail.getRole().equals("ADMIN")){
            throw new AccessDeniedException("You have no permission!");
        }

        return new UserResponseDTO(
            userId.getUserId(),
            userId.getRole(), 
            userId.getNamaDepan(), 
            userId.getNamaBelakang(), 
            userId.getEmail(),
            userId.getIsActive(),
            userId.getCreatedAt(),
            userId.getUpdatedAt()
        );
    }

    public UserResponseDTO updateUser(UUID id, UserRequestDTO updateUserRequest){
        // simpan data user ke userId
        User user = findUserById(id);
        user.setRole(updateUserRequest.getRole());
        user.setNamaDepan(updateUserRequest.getNamaDepan());
        user.setNamaBelakang(updateUserRequest.getNamaBelakang());
        user.setEmail(updateUserRequest.getEmail());
        // save ke database
        userRepository.save(user);
        // return data yang baru
        return new UserResponseDTO(
            user.getUserId(),
            user.getRole(), 
            user.getNamaDepan(), 
            user.getNamaBelakang(), 
            user.getEmail(),
            user.getIsActive(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }

    public String deleteUser(UUID id){
        User user = findUserById(id);
        userRepository.delete(user);
        return "User berhasil dihapus";
    }

    private User findUserById(UUID id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
        return user;
    }

    private User findUserByEmail(String email){
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email tidak ditemukan"));
        return user;
    }
}