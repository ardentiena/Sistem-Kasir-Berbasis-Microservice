package com.sistemkasir.servicedaftarproduk.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class InternalKeyFilter extends OncePerRequestFilter {
    private final String internalApiKey;

    public InternalKeyFilter(String internalApiKey) {
        this.internalApiKey = internalApiKey;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String apiKey = request.getHeader("Internal-API-Key");
        System.out.println("DEBUG - received apiKey: " + apiKey);
        System.out.println("DEBUG - expected apiKey: " + internalApiKey);
        System.out.println("DEBUG - method: " + request.getMethod());
        if (!internalApiKey.equals(apiKey) &&
                (request.getMethod().equalsIgnoreCase("POST") ||
                request.getMethod().equalsIgnoreCase("PATCH"))) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("Forbidden: Invalid Internal API Key");
            return;
        }
        filterChain.doFilter(request, response);
    }
}
