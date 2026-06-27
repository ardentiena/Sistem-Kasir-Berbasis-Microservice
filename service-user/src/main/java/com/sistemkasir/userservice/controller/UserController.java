package com.sistemkasir.userservice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.sistemkasir.userservice.model.User;

@Controller
@RequestMapping("/api")
public class UserController {
    @PostMapping("/auth/register")
    public String registerUser(@RequestBody User user){
        return "tes register";
    }
    @PostMapping("/auth/login")
    public String loginUser(@RequestBody User user){
        return "tes login";
    }
    @GetMapping("/users/{id}")
    public String getUser(String id){
        return "tes get user";
    }
}