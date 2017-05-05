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
package com.nemesis.console.backend.config;

import com.nemesis.console.backend.storefront.DefaultRestAuthenticationProvider;
import com.nemesis.console.backend.storefront.SessionTimeoutCookieFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.ExceptionMappingAuthenticationFailureHandler;

import javax.naming.NamingException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Petar Tahchiev
 * @since 0.6
 */
@Configuration
public class CommonConsoleConfig {

    @Autowired
    private ObjectPostProcessor<Object> opp;

    @Bean(name = { "defaultAuthenticationFailureHandler", "authenticationFailureHandler" })
    protected AuthenticationFailureHandler defaultAuthenticationFailureHandler() {
        Map<String, String> exceptionMappings = new HashMap<>();
        exceptionMappings.put(InternalAuthenticationServiceException.class.getCanonicalName(), "/login?error=servererror");
        exceptionMappings.put(BadCredentialsException.class.getCanonicalName(), "/login?error=authfailed");
        exceptionMappings.put(CredentialsExpiredException.class.getCanonicalName(), "/login?error=credentialsExpired");
        exceptionMappings.put(LockedException.class.getCanonicalName(), "/login?error=locked");
        exceptionMappings.put(DisabledException.class.getCanonicalName(), "/login?error=disabled");
        exceptionMappings.put(AccessDeniedException.class.getCanonicalName(), "/login?error=denied");

        final ExceptionMappingAuthenticationFailureHandler result = new ExceptionMappingAuthenticationFailureHandler();
        result.setExceptionMappings(exceptionMappings);
        result.setDefaultFailureUrl("/login?error=default");
        return result;
    }

    @Bean(name = { "defaultAccessDeniedHandler", "accessDeniedHandler" })
    protected AccessDeniedHandler defaultAccessDeniedHandler() {
        final AccessDeniedHandlerImpl accessDeniedHandler = new AccessDeniedHandlerImpl();
        accessDeniedHandler.setErrorPage("/login?error=denied");

        return accessDeniedHandler;
    }

    @Bean(name = { "defaultAuthenticationManager", "authenticationManager" })
    public AuthenticationManager defaultAuthenticationManager(AuthenticationProvider restAuthenticationProvider) throws Exception {
        return new AuthenticationManagerBuilder(opp).authenticationProvider(restAuthenticationProvider).build();
    }

    @Bean(name = { "defaultRestAuthenticationProvider", "restAuthenticationProvider" })
    public AuthenticationProvider defaultRestAuthenticationProvider(final ConsoleProperties consoleProperties) throws NamingException {
        return new DefaultRestAuthenticationProvider(consoleProperties.getRestBaseUrl());
    }

    @Bean
    public SessionTimeoutCookieFilter defaultSessionTimeoutCookieFilter() {
        return new SessionTimeoutCookieFilter();
    }
}
