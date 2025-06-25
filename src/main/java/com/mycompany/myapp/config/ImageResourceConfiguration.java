package com.mycompany.myapp.config; // Đảm bảo đúng package của bạn

import com.mycompany.myapp.config.ApplicationProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Đánh dấu đây là một class cấu hình Spring
public class ImageResourceConfiguration implements WebMvcConfigurer {

    // Đọc đường dẫn từ application.yml (đã cấu hình ở Bước 1)
    private final String uploadDirectory;

    public ImageResourceConfiguration(ApplicationProperties applicationProperties) { // <-- THÊM THAM SỐ NÀY
        this.uploadDirectory = applicationProperties.getUploadDir(); // Lấy đường dẫn từ ApplicationProperties
    }

    // ----------------------------------------------------

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/content/images/bbkt/**").addResourceLocations("file:" + uploadDirectory);
    }
}
