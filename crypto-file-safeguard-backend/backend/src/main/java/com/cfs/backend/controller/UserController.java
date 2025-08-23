package com.cfs.backend.controller;

import com.cfs.backend.dto.UserDto;
import com.cfs.backend.model.User;
import com.cfs.backend.service.ImageUploadService;
import com.cfs.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final ImageUploadService imageUploadService;
    private final UserService userService;

    public UserController(ImageUploadService imageUploadService, UserService userService) {
        this.imageUploadService = imageUploadService;
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getLoggedInUserDetails(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .profilePictureUrl(user.getProfilePictureUrl())
                .build();

        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/me/picture")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        try {
            // 1. Upload the image to Cloudinary
            String imageUrl = imageUploadService.uploadImage(file);

            // 2. Get the current user's email
            String userEmail = authentication.getName();

            // 3. Update the user's profile picture URL in the database
            userService.updateProfilePicture(userEmail, imageUrl);

            // 4. Return the new URL in the response
            return ResponseEntity.ok(Map.of("profilePictureUrl", imageUrl));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to upload image.");
        }
    }
}