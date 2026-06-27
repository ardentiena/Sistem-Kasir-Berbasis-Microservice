package com.sistemkasir.userservice.controller;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    public String registerUser(){
        return "tes register";
    }

    public String loginUser(){
        return "tes login";
    }

    public String getUser(){
        return "tes get user";
    }
}
