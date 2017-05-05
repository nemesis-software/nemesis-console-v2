/*
 * nemesis Platform - NExt-generation Multichannel E-commerce SYStem
 *
 * Copyright (c) 2010 - 2014 nemesis
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of nemesis
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with nemesis.
 */
package com.nemesis.console.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

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
