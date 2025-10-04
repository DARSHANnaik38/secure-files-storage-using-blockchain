package com.cfs.backend.service;

import com.cfs.backend.blockchain.contract.FileContract;
import com.cfs.backend.dto.FileDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

import java.io.IOException;
import java.math.BigInteger;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class FileStorageService {

    // This is the full, long-lived JWT used for authenticating uploads.
    @Value("${pinata.jwt}")
    private String pinataJwt;

    @Value("${blockchain.ganache.url}")
    private String ganacheUrl;

    @Value("${blockchain.contract.address}")
    private String contractAddress;

    // Inject the service responsible for generating temporary download tokens.
    private final PinataJwtService pinataJwtService;

    public FileStorageService(PinataJwtService pinataJwtService) {
        this.pinataJwtService = pinataJwtService;
    }

    /**
     * Uploads a file to Pinata using the master JWT.
     */
    public Map<String, Object> uploadFileToPinata(MultipartFile file) throws IOException {
        String url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        // For uploads, the full JWT must be used as the Bearer token.
        headers.setBearerAuth(this.pinataJwt);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };
        body.add("file", fileResource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

        String ipfsHash = (String) Objects.requireNonNull(response.getBody()).get("IpfsHash");
        return Map.of("ipfsHash", ipfsHash, "fileName", file.getOriginalFilename(), "fileSize", file.getSize());
    }

    /**
     * Saves the file metadata to the smart contract on the blockchain.
     */
    public TransactionReceipt saveHashOnBlockchain(String ipfsHash, String privateKey, String fileName, long fileSize) throws Exception {
        Web3j web3j = Web3j.build(new HttpService(ganacheUrl));
        Credentials credentials = Credentials.create(privateKey);
        FileContract contract = FileContract.load(contractAddress, web3j, credentials, new DefaultGasProvider());
        return contract.addFile(ipfsHash, BigInteger.valueOf(fileSize), fileName).send();
    }

    /**
     * Retrieves all file records for a given user from the blockchain.
     */
    public List<FileDto> getFilesForUser(String privateKey) throws Exception {
        Web3j web3j = Web3j.build(new HttpService(ganacheUrl));
        Credentials credentials = Credentials.create(privateKey);
        FileContract contract = FileContract.load(contractAddress, web3j, credentials, new DefaultGasProvider());
        List<FileContract.File> filesFromContract = contract.getFiles().send();

        return filesFromContract.stream()
                .map(file -> new FileDto(
                        file.ipfsHash,
                        file.fileName,
                        file.fileSize,
                        file.uploadTimestamp
                ))
                .collect(Collectors.toList());
    }

    /**
     * Generates a secure, temporary (60-second) download link after verifying ownership.
     */
    public String generateSecureDownloadLink(String privateKey, String ipfsHash) throws Exception {
        // Step 1: Verify ownership on the blockchain.
        List<FileDto> userFiles = getFilesForUser(privateKey);
        boolean isOwner = userFiles.stream().anyMatch(file -> file.ipfsHash().equals(ipfsHash));

        if (!isOwner) {
            throw new SecurityException("User is not authorized to access this file.");
        }

        // Step 2: Generate a NEW, short-lived, single-file token.
        String scopedToken = pinataJwtService.generateScopedToken(ipfsHash);

        // Step 3: Create the temporary download URL with the new ephemeral token.
        String gatewayUrl = "https://gateway.pinata.cloud/ipfs/";
        return gatewayUrl + ipfsHash + "?pinataGatewayToken=" + scopedToken;
    }
}

