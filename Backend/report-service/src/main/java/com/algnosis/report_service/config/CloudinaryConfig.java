package com.algnosis.report_service.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dlgj8lqia",
                "api_key", "837975749361521",
                "api_secret", "A_14ms616ydGt8tkqdAZ-3bpKs4"
        ));
    }
}
