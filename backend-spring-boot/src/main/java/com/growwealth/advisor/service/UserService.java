package com.growwealth.advisor.service;

import com.growwealth.advisor.dto.AuthDtos.UpdateProfileRequest;
import com.growwealth.advisor.dto.AuthDtos.UserDto;
import com.growwealth.advisor.entity.User;
import com.growwealth.advisor.exception.ResourceNotFoundException;
import com.growwealth.advisor.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;

    public UserService(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    public UserDto getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return authService.mapToUserDto(user);
    }

    @Transactional
    public UserDto updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getPan() != null && !request.getPan().isBlank()) {
            user.setPan(request.getPan().toUpperCase().trim());
        }
        if (request.getKycStatus() != null && !request.getKycStatus().isBlank()) {
            user.setKycStatus(request.getKycStatus().toLowerCase());
        }

        User updatedUser = userRepository.save(user);
        return authService.mapToUserDto(updatedUser);
    }
}
