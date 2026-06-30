package com.sistemkasir.userservice.controller;

import java.util.List;
import java.util.UUID;

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

import com.sistemkasir.userservice.dto.LoginUserDTO;
import com.sistemkasir.userservice.dto.RegisterUserDTO;
import com.sistemkasir.userservice.dto.UserRequestDTO;
import com.sistemkasir.userservice.dto.UserResponseDTO;
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
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUser(){
        return ResponseEntity.ok(userService.getAllUser());
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable UUID id){
        return ResponseEntity.ok(userService.getUserById(id));
    }
    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable UUID id, @RequestBody UserRequestDTO updateRequest){
        return ResponseEntity.ok(userService.updateUser(id, updateRequest));
    }
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id){
        return ResponseEntity.ok(userService.deleteUser(id));
    }
}