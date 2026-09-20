package com.growwealth.advisor.service;

import com.growwealth.advisor.config.JwtTokenProvider;
import com.growwealth.advisor.dto.AuthDtos.*;
import com.growwealth.advisor.entity.RefreshToken;
import com.growwealth.advisor.entity.User;
import com.growwealth.advisor.exception.ApiException;
import com.growwealth.advisor.repository.RefreshTokenRepository;
import com.growwealth.advisor.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshTokenString = jwtTokenProvider.generateRefreshToken(user.getId());

        saveRefreshToken(user, refreshTokenString);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenString)
                .user(mapToUserDto(user))
                .build();
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new ApiException("An account with this email already exists", HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS");
        }

        User user = User.builder()
                .id("usr_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12))
                .name(request.getName().trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .kycStatus("pending")
                .build();

        User savedUser = userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(savedUser.getId(), savedUser.getEmail());
        String refreshTokenString = jwtTokenProvider.generateRefreshToken(savedUser.getId());

        saveRefreshToken(savedUser, refreshTokenString);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenString)
                .user(mapToUserDto(savedUser))
                .build();
    }

    @Transactional
    public TokenRefreshResponse refreshToken(RefreshTokenRequest request) {
        String tokenStr = request.getRefreshToken();
        RefreshToken refreshToken = refreshTokenRepository.findByTokenAndRevokedFalse(tokenStr)
                .orElseThrow(() -> new ApiException("Invalid or expired refresh token", HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new ApiException("Refresh token has expired", HttpStatus.UNAUTHORIZED, "REFRESH_TOKEN_EXPIRED");
        }

        User user = refreshToken.getUser();
        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        // Revoke old token and save new token
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
        saveRefreshToken(user, newRefreshToken);

        return TokenRefreshResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    @Transactional
    public void logout(String userId) {
        userRepository.findById(userId).ifPresent(refreshTokenRepository::deleteByUser);
    }

    private void saveRefreshToken(User user, String tokenStr) {
        RefreshToken token = RefreshToken.builder()
                .id("rt_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .user(user)
                .token(tokenStr)
                .expiresAt(Instant.now().plus(30, ChronoUnit.DAYS))
                .revoked(false)
                .build();
        refreshTokenRepository.save(token);
    }

    public UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .pan(user.getPan())
                .kycStatus(user.getKycStatus())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : Instant.now().toString())
                .build();
    }
}
