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

import io.nemesis.console.backend.core.NemesisUrlResolver;
import io.nemesis.console.backend.core.impl.DynamicNemesisUrlResolver;
import io.nemesis.console.backend.core.impl.NemesisWebAuthenticationDetails;
import io.nemesis.console.backend.core.impl.PredefinedNemesisUrlResolver;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.AdviceMode;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationDetailsSource;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
@ComponentScan(basePackages = { "io.nemesis.console.backend", "io.nemesis.platform.util" })
@Import(value = { CommonConsoleConfig.class })
@EnableConfigurationProperties(value = ConsoleProperties.class)
@EnableMethodSecurity(prePostEnabled = true, mode = AdviceMode.PROXY)
public class BackendConsoleConfig extends WebSecurityConfigurerAdapter {

    @Resource(name = "defaultAuthenticationFailureHandler")
    private AuthenticationFailureHandler defaultAuthenticationFailureHandler;

    @Resource(name = "defaultAccessDeniedHandler")
    private AccessDeniedHandler defaultAccessDeniedHandler;

    @Bean(name = NemesisUrlResolver.NAME)
    @ConditionalOnProperty(prefix = "nemesis.url.resolver", name = "dynamic", havingValue = "false", matchIfMissing = true)
    public NemesisUrlResolver defaultPredefinedNemesisUrlResolver() {
        return new PredefinedNemesisUrlResolver();
    }

    @Bean(name = NemesisUrlResolver.NAME)
    @ConditionalOnProperty(prefix = "nemesis.url.resolver", name = "dynamic", havingValue = "true")
    public NemesisUrlResolver defaultDynamicNemesisUrlResolver() {
        return new DynamicNemesisUrlResolver();
    }

    // @formatter:off
    
    @Override
    public void configure(final WebSecurity web) {
        web.ignoring().requestMatchers("/resources/**");
    }
    
    @Override
    protected void configure(final HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests()
                .requestMatchers("/resources/img/**").permitAll()
                .requestMatchers("/login").permitAll()
                .requestMatchers("/robots.txt").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/**").hasRole("EMPLOYEEGROUP")
                .and()
            .headers().disable()
            .formLogin()
                .authenticationDetailsSource(createAuthenticationDetailsSource())
                .loginProcessingUrl("/j_spring_security_check")
                .loginPage("/login").permitAll()
                .defaultSuccessUrl("/admin")
                .failureHandler(defaultAuthenticationFailureHandler)
                .permitAll()
                .and()
            .logout()
                .logoutUrl("/j_spring_security_logout")
                .logoutSuccessUrl("/login")
                .permitAll()
                .and()
            .exceptionHandling()
                .accessDeniedHandler(defaultAccessDeniedHandler);
    }

    private AuthenticationDetailsSource<HttpServletRequest, WebAuthenticationDetails> createAuthenticationDetailsSource() {
        return NemesisWebAuthenticationDetails::new;
    }
    
    // @formatter:on

}
