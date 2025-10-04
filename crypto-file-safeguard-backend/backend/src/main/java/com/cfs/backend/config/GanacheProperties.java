package com.cfs.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "ganache")
@Data
public class GanacheProperties {

    private List<Account> accounts;

    @Data
    public static class Account {
        private String address;
        private String privateKey;
    }
}