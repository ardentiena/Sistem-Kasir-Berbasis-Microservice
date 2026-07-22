package com.sistemkasir.servicedaftarproduk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ServicedaftarprodukApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServicedaftarprodukApplication.class, args);
	}

}
