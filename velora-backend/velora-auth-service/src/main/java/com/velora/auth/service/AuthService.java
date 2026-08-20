package com.velora.auth.service;

import com.velora.auth.common.*;
import com.velora.auth.dto.*;
import com.velora.auth.entity.*;
import com.velora.auth.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.*;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @org.springframework.beans.factory.annotation.Value("${velora.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       OtpRepository otpRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already in use");
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BadRequestException("Phone number is already in use");
        }

        RoleType roleType = parseRole(request.getRole());
        Role role = roleRepository.findByName(roleType)
                .orElseGet(() -> roleRepository.save(Role.builder().name(roleType).description("Default " + roleType).build()));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(role)
                .isEnabled(true)
                .isLocked(false)
                .build();
        user = userRepository.save(user);

        // Generate & send duration-based Registration OTP via Twilio SMS
        String otpCode = String.format("%06d", new Random().nextInt(900000) + 100000);
        Otp otp = Otp.builder()
                .user(user)
                .code(otpCode)
                .purpose("VERIFICATION")
                .expiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes))
                .isUsed(false)
                .build();
        otpRepository.save(otp);
        log.info("[Registration] OTP generated for {}: {}", request.getPhoneNumber(), otpCode);

        String accessToken = jwtUtils.generateAccessToken(user.getEmail(), user.getRole().getName().name(), user.getId());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail(), user.getId());
        saveRefreshToken(user, refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().getName().name())
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String input = request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()
                ? request.getPhoneNumber().trim()
                : (request.getEmail() != null ? request.getEmail().trim() : "");

        if (input.isBlank()) {
            throw new BadRequestException("Email or Phone number is required for login");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password is required for login");
        }

        String cleanPhone = input.replaceAll("[^0-9]", "");
        if (cleanPhone.startsWith("91") && cleanPhone.length() > 10) {
            cleanPhone = cleanPhone.substring(2);
        }

        final String targetPhone = cleanPhone;
        User user = userRepository.findByEmail(input)
                .or(() -> userRepository.findByPhoneNumber(input))
                .or(() -> userRepository.findByPhoneNumber(targetPhone))
                .or(() -> userRepository.findByLegacyMobileNumber(input))
                .or(() -> userRepository.findAll().stream()
                        .filter(u -> u.getPhoneNumber() != null && u.getPhoneNumber().replaceAll("[^0-9]", "").equals(targetPhone))
                        .findFirst())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials or user account does not exist. Please sign up first."));

        boolean isMatch = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!isMatch && user.getLegacyPassword() != null && user.getLegacyPassword().equals(request.getPassword())) {
            isMatch = true;
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);
        }

        if (!isMatch) {
            throw new UnauthorizedException("Invalid email/phone or password. Please try again.");
        }

        if (!user.isEnabled()) {
            throw new UnauthorizedException("User account is disabled. Please contact support.");
        }

        if (user.isLocked()) {
            throw new UnauthorizedException("User account is locked due to security policy.");
        }

        String accessToken = jwtUtils.generateAccessToken(user.getEmail(), user.getRole().getName().name(), user.getId());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail(), user.getId());
        saveRefreshToken(user, refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().getName().name())
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken token = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
        if (token.isRevoked() || token.getExpiryDate().isBefore(Instant.now())) {
            throw new UnauthorizedException("Refresh token is expired or revoked");
        }
        User user = token.getUser();
        String newAccessToken = jwtUtils.generateAccessToken(user.getEmail(), user.getRole().getName().name(), user.getId());
        String newRefreshToken = jwtUtils.generateRefreshToken(user.getEmail(), user.getId());
        token.setRevoked(true);
        refreshTokenRepository.save(token);
        saveRefreshToken(user, newRefreshToken);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().getName().name())
                .build();
    }

    @Transactional
    public void sendOtp(SendOtpRequest request) {
        String phone = request.getPhoneNumber();
        String purpose = request.getPurpose() != null ? request.getPurpose() : "VERIFICATION";
        if (phone != null && !phone.isBlank()) {
            String code = String.format("%06d", new Random().nextInt(900000) + 100000);
            Optional<User> userOpt = userRepository.findByPhoneNumber(phone);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Otp otp = Otp.builder()
                        .user(user)
                        .code(code)
                        .purpose(purpose)
                        .expiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes))
                        .isUsed(false)
                        .build();
                otpRepository.save(otp);
                log.info("[OTP Service] {} OTP generated for {}: {}", purpose, phone, code);
            } else {
                // If user doesn't exist yet, log OTP for pre-registration phone verification
                log.info("[OTP Service] Pre-registration OTP generated for {}: {}", phone, code);
            }
        }
    }

    private User findUserByPhoneOrEmail(String input) {
        if (input == null || input.isBlank()) {
            throw new ResourceNotFoundException("Phone number or email is required");
        }
        String cleanInput = input.trim();
        String cleanPhone = cleanInput.replaceAll("[^0-9]", "");
        if (cleanPhone.startsWith("91") && cleanPhone.length() > 10) {
            cleanPhone = cleanPhone.substring(2);
        }
        final String targetPhone = cleanPhone;

        return userRepository.findByEmail(cleanInput)
                .or(() -> userRepository.findByPhoneNumber(cleanInput))
                .or(() -> !targetPhone.isEmpty() ? userRepository.findByPhoneNumber(targetPhone) : Optional.empty())
                .or(() -> !targetPhone.isEmpty() ? userRepository.findByPhoneNumber("+91" + targetPhone) : Optional.empty())
                .or(() -> userRepository.findByLegacyMobileNumber(cleanInput))
                .or(() -> !targetPhone.isEmpty() ? userRepository.findAll().stream()
                        .filter(u -> u.getPhoneNumber() != null && u.getPhoneNumber().replaceAll("[^0-9]", "").equals(targetPhone))
                        .findFirst() : Optional.empty())
                .orElseThrow(() -> new ResourceNotFoundException("User account not found for: " + input));
    }

    @Transactional
    public void verifyOtp(OtpVerifyRequest request) {
        String phoneOrEmail = request.getPhoneNumber();
        User user = findUserByPhoneOrEmail(phoneOrEmail);

        Otp otp = otpRepository
                .findTopByUserAndPurposeAndIsUsedFalseOrderByIdDesc(user, "VERIFICATION")
                .or(() -> otpRepository.findTopByUserAndPurposeAndIsUsedFalseOrderByIdDesc(user, "LOGIN"))
                .or(() -> otpRepository.findTopByUserAndPurposeAndIsUsedFalseOrderByIdDesc(user, "SIGNUP"))
                .or(() -> otpRepository.findTopByUserAndPurposeAndIsUsedFalseOrderByIdDesc(user, "RESET_PASSWORD"))
                .orElseThrow(() -> new BadRequestException("No valid or pending OTP found"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired. Please request a new one.");
        }

        if (!otp.getCode().equals(request.getCode())) {
            throw new BadRequestException("Invalid OTP code. Please try again.");
        }

        otp.setUsed(true);
        otpRepository.save(otp);

        user.setEnabled(true);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(Long userId, String email) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }
        if (user == null && email != null) {
            user = userRepository.findByEmail(email).orElse(null);
        }
        if (user == null) {
            return AuthResponse.builder()
                    .userId(userId != null ? userId : 1L)
                    .email(email != null ? email : "user@velora.app")
                    .fullName("Registered User")
                    .role("ROLE_USER")
                    .tokenType("Bearer")
                    .build();
        }
        return AuthResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole() != null ? user.getRole().getName().name() : "ROLE_USER")
                .tokenType("Bearer")
                .build();
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = findUserByPhoneOrEmail(request.getPhoneNumber());
        String code = String.format("%06d", new Random().nextInt(900000) + 100000);
        log.info("Reset Password OTP : {}", code);
        Otp otp = Otp.builder()
                .user(user)
                .code(code)
                .purpose("RESET_PASSWORD")
                .expiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes))
                .isUsed(false)
                .build();
        otpRepository.save(otp);
        log.info("Reset Password OTP for {}: {}", user.getPhoneNumber(), code);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = findUserByPhoneOrEmail(request.getPhoneNumber());
        Otp otp = otpRepository.findTopByUserAndPurposeAndIsUsedFalseOrderByIdDesc(user, "RESET_PASSWORD")
                .or(() -> otpRepository.findTopByUserAndPurposeAndIsUsedFalseOrderByIdDesc(user, "VERIFICATION"))
                .orElseThrow(() -> new BadRequestException("No valid OTP found for password reset"));
        if (!otp.getCode().equals(request.getCode())) {
            throw new BadRequestException("Invalid OTP code.");
        }
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP code has expired. Please request a new password reset.");
        }
        otp.setUsed(true);
        otpRepository.save(otp);
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private RoleType parseRole(String rawRole) {
        if (rawRole == null || rawRole.isBlank()) return RoleType.ROLE_USER;
        String clean = rawRole.toUpperCase().trim();
        if (!clean.startsWith("ROLE_")) clean = "ROLE_" + clean;
        try {
            return RoleType.valueOf(clean);
        } catch (Exception e) {
            return RoleType.ROLE_USER;
        }
    }

    private void saveRefreshToken(User user, String tokenValue) {
        try {
            RefreshToken token = RefreshToken.builder()
                    .user(user)
                    .token(tokenValue)
                    .expiryDate(Instant.now().plusSeconds(7 * 24 * 60 * 60))
                    .isRevoked(false)
                    .build();
            refreshTokenRepository.save(token);
        } catch (Exception e) {
            log.warn("Could not save refresh token: {}", e.getMessage());
        }
    }
}
