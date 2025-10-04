package com.cfs.backend.repository;

import com.cfs.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Finds a user by their unique email address.
    Optional<User> findByEmail(String email);

    // Finds all assigned Ethereum addresses to check for available accounts.
    // This is used by GanacheService.
    @Query("SELECT u.ethereumAddress FROM User u WHERE u.ethereumAddress IS NOT NULL")
    List<String> findAllEthereumAddresses();
}