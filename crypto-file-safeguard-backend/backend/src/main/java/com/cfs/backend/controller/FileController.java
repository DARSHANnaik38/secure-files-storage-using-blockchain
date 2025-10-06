package com.cfs.backend.controller;

import com.cfs.backend.dto.FileDto;
import com.cfs.backend.model.User;
import com.cfs.backend.service.FileStorageService;
import org.springframework.core.io.Resource; // <-- ADD THIS IMPORT
import org.springframework.http.HttpHeaders;   // <-- ADD THIS IMPORT
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;    // <-- ADD THIS IMPORT
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

    // This endpoint remains unchanged
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> uploadResult = fileStorageService.uploadFileToPinata(file);
            return ResponseEntity.ok(uploadResult);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("File upload to Pinata failed.");
        }
    }

    // This endpoint remains unchanged
    @PostMapping("/save-hash")
    public ResponseEntity<String> saveHash(
            @RequestBody Map<String, Object> requestBody,
            Authentication authentication
    ) {
        try {
            String ipfsHash = (String) requestBody.get("ipfsHash");
            String fileName = (String) requestBody.get("fileName");
            long fileSize = ((Number) requestBody.get("fileSize")).longValue();

            User user = (User) authentication.getPrincipal();
            String privateKey = user.getPrivateKey();

            fileStorageService.saveHashOnBlockchain(ipfsHash, privateKey, fileName, fileSize);

            return ResponseEntity.ok("Hash saved to blockchain successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to save hash to blockchain.");
        }
    }

    // This endpoint remains unchanged
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

    // --- REPLACE THE ENTIRE DOWNLOAD ENDPOINT WITH THIS ---
    @GetMapping("/download/{ipfsHash}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String ipfsHash,
            Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            String privateKey = user.getPrivateKey();

            // 1. Get the file content as a Resource from the service
            Resource resource = fileStorageService.downloadFileAsResource(privateKey, ipfsHash);

            // 2. Find the original filename to tell the browser what to name the file
            String filename = fileStorageService.getFilesForUser(privateKey).stream()
                    .filter(f -> f.ipfsHash().equals(ipfsHash))
                    .findFirst()
                    .map(FileDto::fileName)
                    .orElse("downloaded-file");

            // 3. Return the file data directly to the user for download
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}