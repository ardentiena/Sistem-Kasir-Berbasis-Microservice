package com.sistemkasir.userservice.controller;

import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemkasir.userservice.dto.LoginUserDTO;
import com.sistemkasir.userservice.dto.RegisterUserDTO;
import com.sistemkasir.userservice.dto.UserResponseDTO;
import com.sistemkasir.userservice.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/auth/register")
    public UserResponseDTO registerUser(@RequestBody RegisterUserDTO userRegister){
        return userService.register(userRegister);
    }
    @PostMapping("/auth/login")
    public String loginUser(@RequestBody LoginUserDTO loginUser){
        return userService.login(loginUser);
    }
    @GetMapping("/users/{id}")
    public UserResponseDTO getUser(@PathVariable UUID id){
        return userService.getUserById(id);
    }
}