package com.cfs.backend.service;

import com.cfs.backend.config.GanacheProperties; // Import the properties class
import com.cfs.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class GanacheService {

    private final UserRepository userRepository;
    private final GanacheProperties ganacheProperties;

    @Autowired
    public GanacheService(UserRepository userRepository, GanacheProperties ganacheProperties) {
        this.userRepository = userRepository;
        this.ganacheProperties = ganacheProperties;
    }

    /**
     * Finds the first available Ganache account that is not already assigned to a user in the database.
     * This method is stateless and safe to call across application restarts.
     * @return A Map.Entry containing the public address (key) and private key (value) of the available account.
     */
    public Map.Entry<String, String> assignNewAccount() {
        // Step 1: Get the list of all addresses already saved in the database.
        List<String> usedAddresses = userRepository.findAllEthereumAddresses();

        // Step 2: Get the master list of all 10 accounts from application.properties.
        List<GanacheProperties.Account> allAccounts = ganacheProperties.getAccounts();

        // Step 3: Find the first account from the master list that is NOT in the used list.
        Optional<GanacheProperties.Account> availableAccount = allAccounts.stream()
                .filter(account -> !usedAddresses.contains(account.getAddress()))
                .findFirst();

        // Step 4: If an account is available, return its details. Otherwise, throw an exception.
        if (availableAccount.isPresent()) {
            GanacheProperties.Account account = availableAccount.get();
            return Map.entry(account.getAddress(), account.getPrivateKey());
        } else {
            throw new RuntimeException("No available Ganache accounts to assign.");
        }
    }
}