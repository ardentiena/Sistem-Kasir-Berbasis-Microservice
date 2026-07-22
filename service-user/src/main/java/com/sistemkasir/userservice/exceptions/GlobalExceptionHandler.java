package com.sistemkasir.userservice.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Menangkap semua RuntimeException yang dilempar dari Service/Controller
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> response = new HashMap<>();
        
        // ex.getMessage() akan mengambil teks "Email tidak ditemukan" atau "Password salah"
        response.put("message", ex.getMessage()); 
        
        // Mengembalikan status 400 Bad Request atau 401 Unauthorized sesuai kebutuhan
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}