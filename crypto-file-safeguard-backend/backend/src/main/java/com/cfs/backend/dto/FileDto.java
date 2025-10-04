package com.cfs.backend.dto;

import java.math.BigInteger;

public record FileDto(
        String ipfsHash,
        String fileName,
        BigInteger fileSize,
        BigInteger uploadTimestamp
) {
}