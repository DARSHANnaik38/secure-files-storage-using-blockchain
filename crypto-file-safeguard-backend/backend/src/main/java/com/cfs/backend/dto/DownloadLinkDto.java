package com.cfs.backend.dto;

/**
 * A simple Data Transfer Object to carry the secure download URL to the frontend.
 */
public record DownloadLinkDto(String secureUrl) {
}

