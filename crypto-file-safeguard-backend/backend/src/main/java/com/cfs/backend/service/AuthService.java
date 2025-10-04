package com.cfs.backend.service;

import com.cfs.backend.dto.AuthResponse;
import com.cfs.backend.dto.LoginRequest;
import com.cfs.backend.dto.RegisterRequest;
import com.cfs.backend.model.User;
import com.cfs.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map; // Import Map

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final GanacheService ganacheService; // Inject GanacheService

    @Autowired
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       GanacheService ganacheService) { // Update constructor
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.ganacheService = ganacheService; // Add this
    }

    public void registerUser(RegisterRequest request) { // Removed blockchainAddress from parameters
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalStateException("Email already in use");
        }

        // Assign a new Ganache account
        Map.Entry<String, String> assignedAccount = ganacheService.assignNewAccount();

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phoneNumber(request.phoneNumber())
                .ethereumAddress(assignedAccount.getKey()) // Save the assigned address
                .privateKey(assignedAccount.getValue())    // Save the assigned private key
                .build();

        userRepository.save(user);
    }

    public AuthResponse loginUser(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

        String jwtToken = jwtService.generateToken(user);

        // Build the full response, including the user's private key for front-end use
        return AuthResponse.builder()
                .token(jwtToken)
                .privateKey(user.getPrivateKey())
                .ethereumAddress(user.getEthereumAddress())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}