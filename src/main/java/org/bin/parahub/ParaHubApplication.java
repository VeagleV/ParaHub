package org.bin.parahub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ParaHubApplication {

	//netstat -ano | findstr :8080
	//taskkill /PID 1234 /F

	/*
			Shortcuts
		  press r + enter to restart the server
		  press u + enter to show server url
		  press o + enter to open in browser
		  press c + enter to clear console
		  press q + enter to quit
	 */
	public static void main(String[] args) {
		SpringApplication.run(ParaHubApplication.class, args);
	}

}
