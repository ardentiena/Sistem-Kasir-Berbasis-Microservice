package com.sistemkasir.userservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.sistemkasir.userservice.config.JwtUtil;
import com.sistemkasir.userservice.dto.LoginUserDTO;
import com.sistemkasir.userservice.dto.RegisterUserDTO;
import com.sistemkasir.userservice.dto.UserRequestDTO;
import com.sistemkasir.userservice.dto.UserResponseDTO;
import com.sistemkasir.userservice.model.User;
import com.sistemkasir.userservice.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

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
        Optional<User> userEmail = userRepository.findByEmail(userLogin.getEmail());
        if(userEmail.isEmpty()){
            throw new RuntimeException("Email tidak ditemukan");
        }
        // cek jika password sama dengan di database
        if(!passwordEncoder.matches(userLogin.getPassword(), userEmail.get().getPassword())){
            throw new RuntimeException("Password salah");
        }
        // return jwt key yang digenerate
        return jwtUtil.generateToken(userEmail.get());
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
        // cari user berdasarkan id dan simpan ke userId
       // Optional itu untuk jaga-jaga kalau datanya tidak ada
        Optional<User> userId = findUserById(id);
        // ini supaya tidak perlu userId.get() satu-satu lagi
        User user = userId.get();

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

    public UserResponseDTO updateUser(UUID id, UserRequestDTO updateUserRequest){
        // simpan data user ke userId
        Optional<User> userId = findUserById(id);
        // set data user tadi ke data yang baru
        User user = userId.get();
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
        Optional<User> user = findUserById(id);
        User existingUser = user.get();
        userRepository.delete(existingUser);
        return "User berhasil dihapus";
    }

    private Optional<User> findUserById(UUID id){
        Optional<User> user = userRepository.findById(id);
        if(user.isEmpty()){
            throw new RuntimeException("User tidak ditemukan");
        }
        return user;
    }
}