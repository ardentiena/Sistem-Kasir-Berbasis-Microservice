package com.sistemkasir.userservice.controller;

import java.util.List;
import java.util.UUID;

import com.sistemkasir.userservice.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemkasir.userservice.service.UserService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/auth/register")
    public ResponseEntity<UserResponseDTO> registerUser(@RequestBody RegisterUserDTO userRegister){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(userRegister));
    }
    @PostMapping("/auth/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginUserDTO loginUser){
        return ResponseEntity.ok(userService.login(loginUser));
    }
    @PostMapping("/users/assign")
    public ResponseEntity<String> assignUserToCabang(@Valid @RequestBody AssignUserToCabangDTO request) {
        return ResponseEntity.ok(userService.assignUserToCabang(request));
    }
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUser(){
        return ResponseEntity.ok(userService.getAllUser());
    }
    @GetMapping("/users/{kodePegawai}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable String kodePegawai){
        return ResponseEntity.ok(userService.getUserByKodePegawai(kodePegawai));
    }
    @PutMapping("/users/{kodePegawai}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable String kodePegawai, @RequestBody UserRequestDTO updateRequest){
        return ResponseEntity.ok(userService.updateUser(kodePegawai, updateRequest));
    }
    @DeleteMapping("/users/{kodePegawai}")
    public ResponseEntity<String> deleteUser(@PathVariable String kodePegawai){
        return ResponseEntity.ok(userService.deleteUser(kodePegawai));
    }

    @PutMapping("/auth/ganti-password")
    public ResponseEntity<String> gantiPassword(@RequestBody SetPasswordDTO dto) {
        userService.gantiPassword(dto);
        return ResponseEntity.ok("Password berhasil diperbarui");
    }
}