package com.ruedavargas.api.service;

import com.ruedavargas.api.dto.AuthResponse;
import com.ruedavargas.api.dto.LoginRequest;
import com.ruedavargas.api.dto.RegisterRequest;
import com.ruedavargas.api.dto.UserResponseDto;

public interface AuthService {
    UserResponseDto register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserResponseDto getProfile(String userId);
}
