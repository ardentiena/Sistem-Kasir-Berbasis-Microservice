package com.sistemkasir.transaksi_jual.config;

import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class InternalKeyFilter extends OncePerRequestFilter{
    private final String internalApiKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String apiKey = request.getHeader("Internal-API-Key");
        if (!internalApiKey.equals(apiKey) && request.getMethod().equalsIgnoreCase("PATCH")) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("Forbidden: Invalid Internal API Key");
            return;
        }
        filterChain.doFilter(request, response);
    }

}
