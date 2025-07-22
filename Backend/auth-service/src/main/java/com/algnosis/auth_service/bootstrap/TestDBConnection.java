package com.algnosis.auth_service.bootstrap;

import com.algnosis.auth_service.entity.Test;
import com.algnosis.auth_service.repository.TestRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class TestDBConnection {

    @Bean
    CommandLineRunner init(TestRepository repo) {
        return args -> {
            Test user = new Test();
            user.setName("Mongo Test User");
            repo.save(user);
            System.out.println("✅ Mongo connected and test user saved.");
        };
    }
}
