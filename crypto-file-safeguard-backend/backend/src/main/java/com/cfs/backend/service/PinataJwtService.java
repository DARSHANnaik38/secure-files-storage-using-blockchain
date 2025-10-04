package com.cfs.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PinataJwtService {

    @Value("${pinata.api.key}")
    private String pinataApiKey;

    @Value("${pinata.api.secret}")
    private String pinataApiSecret;

    /**
     * Generates a short-lived (60 seconds) JWT that is scoped to a single IPFS hash.
     * @param ipfsHash The IPFS CID that the token will be authorized to access.
     * @return A signed JWT string.
     */
    public String generateScopedToken(String ipfsHash) {
        // The secret key used for signing the JWT, derived from your Pinata API Secret
        SecretKey key = Keys.hmacShaKeyFor(pinataApiSecret.getBytes(StandardCharsets.UTF_8));

        // Set the token to expire in 60 seconds from now
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Date exp = new Date(nowMillis + 60 * 1000); // Expires in 60 seconds

        // Build the custom claims required by Pinata for a scoped token
        Map<String, Object> pinataAuth = new HashMap<>();
        pinataAuth.put("cid", ipfsHash); // Scope the token to a single file hash
        pinataAuth.put("exp", exp.getTime() / 1000); // Expiration in Unix timestamp seconds
        pinataAuth.put("nbf", now.getTime() / 1000 - 5); // Not before, with a 5-second leeway

        // Build the final JWT
        return Jwts.builder()
                .claim("uid", pinataApiKey) // User ID is your API Key
                .claim("pinata_authorization", pinataAuth)
                .setId(UUID.randomUUID().toString()) // Unique ID for the token
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}

