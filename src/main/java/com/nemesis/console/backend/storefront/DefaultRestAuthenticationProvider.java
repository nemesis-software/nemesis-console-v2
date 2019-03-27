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
package com.nemesis.console.backend.storefront;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.HttpClientConnectionManager;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.ssl.SSLContexts;
import org.apache.http.util.EntityUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.AuthorityUtils;

import javax.net.ssl.SSLContext;
import java.io.IOException;
import java.nio.charset.Charset;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;

/**
 * @author Petar Tahchiev
 * @since 0.6
 */
public class DefaultRestAuthenticationProvider implements AuthenticationProvider {

    protected final Logger LOG = LogManager.getLogger(getClass());

    private String restBaseUrl;

    public DefaultRestAuthenticationProvider(final String restBaseUrl) {
        this.restBaseUrl = restBaseUrl;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        final String username = (String) authentication.getPrincipal();
        final String password = (String) authentication.getCredentials();

        final UserData userData;
        try {
            SSLContext context = SSLContexts.custom().loadTrustMaterial(null, new TrustSelfSignedStrategy()).build();
            SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(context, NoopHostnameVerifier.INSTANCE);
            Registry<ConnectionSocketFactory> registry = RegistryBuilder.<ConnectionSocketFactory>create().register("https", csf).build();
            HttpClientConnectionManager ccm = new PoolingHttpClientConnectionManager(registry);

            HttpClient httpclient = HttpClientBuilder.create().setConnectionManager(ccm).setSSLSocketFactory(csf).build();

            /**
             * It can't be POST because the CSRF is triggered.
             */
            HttpGet httpGet = new HttpGet(restBaseUrl + "auth");

            LOG.debug("Calling: " + restBaseUrl + "auth");

            httpGet.setHeader("X-Nemesis-Username", username);
            httpGet.setHeader("X-Nemesis-Password", password);

            HttpResponse response2 = httpclient.execute(httpGet);
            HttpEntity entity2 = response2.getEntity();
            final String response = EntityUtils.toString(entity2, Charset.defaultCharset());
            LOG.info(response);
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(JsonParser.Feature.AUTO_CLOSE_SOURCE, true);
            userData = mapper.readValue(response, UserData.class);
            if (userData.getToken() == null) {
                throw new BadCredentialsException("Invalid username/password");
            }

            final ConsoleUserPrincipal principal =
                            new ConsoleUserPrincipal(userData.getUsername(), password, AuthorityUtils.createAuthorityList(userData.getAuthorities()));
            principal.setExpiryTime(userData.getExpiryTime());
            principal.setToken(userData.getToken());

            return new UsernamePasswordAuthenticationToken(principal, password, principal.getAuthorities());
        } catch (NoSuchAlgorithmException | KeyManagementException | KeyStoreException | IOException e) {
            LOG.error(e.getMessage(), e);
            throw new InternalAuthenticationServiceException(e.getMessage());
        }
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }
}
