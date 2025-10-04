package com.cfs.backend.controller;

import com.cfs.backend.dto.DownloadLinkDto;
import com.cfs.backend.dto.FileDto;
import com.cfs.backend.model.User;
import com.cfs.backend.service.FileStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // The service now returns a map with ipfsHash, fileName, and fileSize
            Map<String, Object> uploadResult = fileStorageService.uploadFileToPinata(file);
            return ResponseEntity.ok(uploadResult);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("File upload to Pinata failed.");
        }
    }

    @PostMapping("/save-hash")
    public ResponseEntity<String> saveHash(
            @RequestBody Map<String, Object> requestBody, // Accept a Map of generic objects
            Authentication authentication
    ) {
        try {
            String ipfsHash = (String) requestBody.get("ipfsHash");
            String fileName = (String) requestBody.get("fileName");
            // Correctly extract and convert the fileSize from the request
            long fileSize = ((Number) requestBody.get("fileSize")).longValue();

            User user = (User) authentication.getPrincipal();
            String privateKey = user.getPrivateKey();

            // Pass all required parameters to the service layer
            fileStorageService.saveHashOnBlockchain(ipfsHash, privateKey, fileName, fileSize);

            return ResponseEntity.ok("Hash saved to blockchain successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to save hash to blockchain.");
        }
    }

    @GetMapping("/my-files")
    public ResponseEntity<List<FileDto>> getMyFiles(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            String privateKey = user.getPrivateKey();
            List<FileDto> userFiles = fileStorageService.getFilesForUser(privateKey);
            return ResponseEntity.ok(userFiles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/download/{ipfsHash}")
    public ResponseEntity<?> getDownloadLink(
            @PathVariable String ipfsHash,
            Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            String privateKey = user.getPrivateKey();
            String secureUrl = fileStorageService.generateSecureDownloadLink(privateKey, ipfsHash);
            return ResponseEntity.ok(new DownloadLinkDto(secureUrl));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}

