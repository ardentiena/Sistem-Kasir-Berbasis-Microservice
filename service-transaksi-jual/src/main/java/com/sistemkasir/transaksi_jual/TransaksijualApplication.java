package com.sistemkasir.transaksi_jual;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TransaksijualApplication {

	public static void main(String[] args) {
		SpringApplication.run(TransaksijualApplication.class, args);
	}

}
