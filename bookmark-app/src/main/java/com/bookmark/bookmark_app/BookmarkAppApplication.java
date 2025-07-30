package com.bookmark.bookmark_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@EnableMongoAuditing
@SpringBootApplication
public class BookmarkAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookmarkAppApplication.class, args);
	}

}
