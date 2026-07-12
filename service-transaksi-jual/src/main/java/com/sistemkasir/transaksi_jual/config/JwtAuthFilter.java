package com.sistemkasir.transaksi_jual.config;

import java.io.IOException;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter{
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        System.out.println("DEBUG - authHeader: " + authHeader);

        if(authHeader != null && authHeader.startsWith("Bearer")){
            String token = authHeader.substring(7);
            boolean isValid = jwtUtil.validateToken(token);
            System.out.println("DEBUG - isValid: " + isValid);
            if(isValid){
                String email = jwtUtil.getEmailFromToken(token);
                String role = jwtUtil.getRoleFromToken(token);
                System.out.println("DEBUG - email: " + email + ", role: " + role);
                List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        email, null, authorities
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("DEBUG - authorities set: " + authorities);
            }
        }
        filterChain.doFilter(request, response);
    }
}
