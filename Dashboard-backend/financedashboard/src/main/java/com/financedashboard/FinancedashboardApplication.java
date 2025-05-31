package com.financedashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
@EntityScan(basePackages = "com.financedashboard.entities") // Ensure only valid entity packages are scanned
public class FinancedashboardApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinancedashboardApplication.class, args);
	}

}
