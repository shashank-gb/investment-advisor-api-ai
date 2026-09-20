package com.growwealth.advisor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableTransactionManagement
public class InvestmentAdvisorApplication {

    public static void main(String[] args) {
        SpringApplication.run(InvestmentAdvisorApplication.class, args);
    }
}
