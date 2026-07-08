package com.sistemkasir.servicepembayaran;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ServicepembayaranApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServicepembayaranApplication.class, args);
	}

}
