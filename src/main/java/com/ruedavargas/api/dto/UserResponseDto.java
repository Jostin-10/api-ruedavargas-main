package com.ruedavargas.api.dto;

import com.ruedavargas.api.entity.Role;
import com.ruedavargas.api.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private UUID id;
    private String email;
    private String name;
    private Role role;
    private Integer loyaltyPoints;
    private String employeeId;
    private String phone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserResponseDto fromEntity(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .loyaltyPoints(user.getLoyaltyPoints())
                .employeeId(user.getEmployeeId())
                .phone(user.getPhone())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
