package com.ruedavargas.api.controller;

import com.ruedavargas.api.dto.*;
import com.ruedavargas.api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDto>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponseDto user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Usuario registrado exitosamente", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse result = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Autenticación exitosa", result));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDto>> getProfile(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        UserResponseDto profile = authService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.success("Perfil de usuario", profile));
    }

    @GetMapping("/admin-only")
    public ResponseEntity<Map<String, String>> adminOnly() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Bienvenido, Administrador");
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/technical-area", "/cashier-area"})
    public ResponseEntity<Map<String, String>> technicalArea() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Área técnica y despacho de insumos");
        return ResponseEntity.ok(response);
    }
}
