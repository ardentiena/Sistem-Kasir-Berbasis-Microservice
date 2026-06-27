package com.sistemkasir.userservice.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.sistemkasir.userservice.config.JwtUtil;
import com.sistemkasir.userservice.dto.LoginUserDTO;
import com.sistemkasir.userservice.dto.RegisterUserDTO;
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
       
        Optional<User> registerEmail = userRepository.findByEmail(userRegister.getEmail());
        if(registerEmail.isPresent()){
            throw new RuntimeException("Email sudah terdaftar");
        }
        String hashedPassword = passwordEncoder.encode(userRegister.getPassword());

        User newUser = new User();
        newUser.setNamaDepan(userRegister.getNamaDepan());
        newUser.setNamaBelakang(userRegister.getNamaBelakang());
        newUser.setEmail(userRegister.getEmail());
        newUser.setPassword(hashedPassword);
        newUser.setRole(userRegister.getRole());
        newUser.setIsActive(true);
        userRepository.save(newUser);

        return new UserResponseDTO(
            newUser.getRole(), 
            newUser.getNamaDepan(), 
            newUser.getNamaBelakang(), 
            newUser.getEmail()
        );
    }

    public String login(LoginUserDTO userLogin){
        Optional<User> userEmail = userRepository.findByEmail(userLogin.getEmail());
        if(userEmail.isEmpty()){
            throw new RuntimeException("Email tidak ditemukan");
        }
        if(!passwordEncoder.matches(userLogin.getPassword(), userEmail.get().getPassword())){
            throw new RuntimeException("Password salah");
        }
        return jwtUtil.generateToken(userEmail.get());
    }

    public UserResponseDTO getUserById(UUID id){
        Optional<User> userId = userRepository.findById(id);
        if(userId.isEmpty()){
            throw new RuntimeException("Id tidak ditemukan");
        }
        return new UserResponseDTO(
            userId.get().getRole(), 
            userId.get().getNamaDepan(), 
            userId.get().getNamaBelakang(), 
            userId.get().getEmail()
        );
    }
}

    // public String registerUser(User user){
    //     try {
    //         HttpRequest request = HttpRequest.newBuilder()
    //             .uri(URI.create(BASE_URL))
    //             .header("Content-Type", "application/json")
    //             .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(user)))
    //             .build();
    //         HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    //         return response.body();
    //     } catch (Exception e) {
    //         return "Error: " + e.getMessage();
    //     }
    // }