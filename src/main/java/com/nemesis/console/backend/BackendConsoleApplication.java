package com.nemesis.console.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;

/**
 * Main entry point for the nemesis backend console.
 *
 * @author Petar Tahchiev
 * @since 1.0
 */
@SpringBootApplication
public class BackendConsoleApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(BackendConsoleApplication.class);
    }

    public static void main(String[] args) {

        SpringApplication application = new SpringApplication(BackendConsoleApplication.class);
        application.setWebEnvironment(true);
        //application.setBanner(new NemesisResourceBanner(new ClassPathResource("nemesis-banner.txt")));

        application.run(args);
    }
}
