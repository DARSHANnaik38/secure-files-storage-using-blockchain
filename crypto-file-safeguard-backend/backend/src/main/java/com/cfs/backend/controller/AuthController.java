package com.cfs.backend.controller;

import com.cfs.backend.dto.AuthResponse;
import com.cfs.backend.dto.LoginRequest;
import com.cfs.backend.dto.RegisterRequest;
import com.cfs.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // The GanacheService is no longer needed here.
    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        // The AuthService now handles Ganache account assignment internally.
        authService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // The AuthService's login method now returns the complete AuthResponse,
        // including the token and private key.
        AuthResponse response = authService.loginUser(request);
        return ResponseEntity.ok(response);
    }
}