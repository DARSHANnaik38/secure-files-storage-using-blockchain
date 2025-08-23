package com.cfs.backend.repository;

import com.cfs.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA will automatically create a query for us
    // based on the method name "findByEmail"
    Optional<User> findByEmail(String email);
}