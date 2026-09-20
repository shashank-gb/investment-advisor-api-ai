package com.growwealth.advisor.controller;

import com.growwealth.advisor.dto.AuthDtos.UpdateProfileRequest;
import com.growwealth.advisor.dto.AuthDtos.UserDto;
import com.growwealth.advisor.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/user", "/user"})
@Tag(name = "User Profile", description = "Endpoints for viewing and updating investor profile and KYC information")
@SecurityRequirement(name = "BearerAuth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile", description = "Retrieves profile, PAN, and KYC status for the authenticated user")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Updates profile details such as phone, PAN, and KYC verification status")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal String userId,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }
}
