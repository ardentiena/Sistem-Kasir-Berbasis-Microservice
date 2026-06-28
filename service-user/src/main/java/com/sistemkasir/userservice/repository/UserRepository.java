package com.sistemkasir.userservice.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistemkasir.userservice.model.User;

    
public interface UserRepository extends JpaRepository<User, UUID>{
    public Optional<User> findByEmail(String email);
}
