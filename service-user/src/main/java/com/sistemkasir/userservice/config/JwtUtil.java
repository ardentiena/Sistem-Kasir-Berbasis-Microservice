package com.sistemkasir.userservice.config;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.sistemkasir.userservice.model.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(User user){
        return Jwts.builder()
            .setSubject(user.getEmail())
            .claim("role", user.getRole())
            .claim("kodeCabang", user.getCabang() != null ? user.getCabang().getKodeCabang() : null)
            .claim("harusGantiPassword", user.getHarusGantiPassword())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningkey())
            .compact();
    }

    public String getEmailFromToken(String token){
        return Jwts.parserBuilder()
            .setSigningKey(getSigningkey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public String getRoleFromToken(String token){
        return Jwts.parserBuilder()
            .setSigningKey(getSigningkey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .get("role", String.class);
    }

    public boolean validateToken(String token){
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningkey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private SecretKey getSigningkey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
