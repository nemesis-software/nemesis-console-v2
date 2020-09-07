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
package io.nemesis.console.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ResourceProperties;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

@EnableWebMvc
@Configuration
@ComponentScan(basePackages = { "io.nemesis.console.backend.storefront" })
public class BackendConsoleMvcConfig implements WebMvcConfigurer {

    @Autowired
    private ResourceProperties resourceProperties;

    @Autowired
    private WebMvcProperties mvcProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if (!this.resourceProperties.isAddMappings()) {
            return;
        }
        Duration cachePeriod = this.resourceProperties.getCache().getPeriod();

        if (cachePeriod == null) {
            cachePeriod = Duration.of(365, ChronoUnit.DAYS);
        }

        if (!registry.hasMappingForPattern("/webjars/**")) {
            registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/").setCachePeriod(
                            (int) cachePeriod.getSeconds());
        }
        String staticPathPattern = this.mvcProperties.getStaticPathPattern();
        if (!registry.hasMappingForPattern(staticPathPattern)) {

            registry.addResourceHandler(staticPathPattern).addResourceLocations(this.resourceProperties.getStaticLocations()).setCachePeriod(
                            (int) cachePeriod.getSeconds());
        }
    }

    @Bean(name = { "defaultViewResolver", "viewResolver" })
    protected ViewResolver defaultViewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setViewClass(org.springframework.web.servlet.view.JstlView.class);
        viewResolver.setPrefix("/WEB-INF/views/");
        viewResolver.setSuffix(".jsp");
        viewResolver.setRedirectHttp10Compatible(false);

        return viewResolver;
    }
}
