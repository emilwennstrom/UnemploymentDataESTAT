package se.emwe.estat_unemployment;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import static java.time.temporal.ChronoUnit.SECONDS;

@SpringBootApplication
public class EstatUnemploymentApplication {

	public static void main(String[] args) {
		SpringApplication.run(EstatUnemploymentApplication.class, args);
	}

}


