package com.sistemkasir.servicedaftarproduk.config;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secretKey;
    
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
    
    public String getRoleFromToken(String token){
        return Jwts.parserBuilder()
            .setSigningKey(getSigningkey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .get("role", String.class);
    }

    public String getEmailFromToken(String token){
        return Jwts.parserBuilder()
            .setSigningKey(getSigningkey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
    
    private SecretKey getSigningkey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
