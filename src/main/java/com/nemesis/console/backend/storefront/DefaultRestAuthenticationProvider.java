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
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.protocol.HttpClientContext;
import org.apache.hc.core5.http.ParseException;
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

        return authenticateWithHttp11(username, password);
    }

    public Authentication authenticateWithHttp11(final String username, final String password) {
        final UserData userData;
        try {
            SSLContext context = SSLContexts.custom().loadTrustMaterial(null, new TrustSelfSignedStrategy()).build();
            SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(context, NoopHostnameVerifier.INSTANCE);
            Registry<ConnectionSocketFactory> registry = RegistryBuilder.<ConnectionSocketFactory>create().register("https", csf).build();
            HttpClientConnectionManager ccm = new PoolingHttpClientConnectionManager(registry);

            HttpClient httpclient = HttpClientBuilder.create().setConnectionManager(ccm).setSSLSocketFactory(csf).build();

            /*
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

    public Authentication authenticateWithHttp2(final String username, final String password) {
        final UserData userData;
        try {
            SSLContext context = SSLContexts.custom().loadTrustMaterial(null, new TrustSelfSignedStrategy()).build();
            org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory csf =
                            new org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory(context, new NoopHostnameVerifier());
            org.apache.hc.core5.http.config.Registry<org.apache.hc.client5.http.socket.ConnectionSocketFactory> registry =
                            org.apache.hc.core5.http.config.RegistryBuilder.<org.apache.hc.client5.http.socket.ConnectionSocketFactory>create().register(
                                            "https", csf).build();
            org.apache.hc.client5.http.io.HttpClientConnectionManager ccm = new org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager(registry);

            org.apache.hc.client5.http.classic.HttpClient httpClient = org.apache.hc.client5.http.impl.classic.HttpClients.createMinimal(ccm);

            /*
             * It can't be POST because the CSRF is triggered.
             */
            org.apache.hc.client5.http.classic.methods.HttpGet httpGet = new org.apache.hc.client5.http.classic.methods.HttpGet(restBaseUrl + "auth");

            LOG.debug("Calling: " + restBaseUrl + "auth");

            httpGet.setHeader("X-Nemesis-Username", username);
            httpGet.setHeader("X-Nemesis-Password", password);

            org.apache.hc.client5.http.impl.classic.CloseableHttpResponse response2 =
                            (CloseableHttpResponse) httpClient.execute(httpGet, new HttpClientContext());
            org.apache.hc.core5.http.HttpEntity entity2 = response2.getEntity();
            final String response = org.apache.hc.core5.http.io.entity.EntityUtils.toString(entity2, Charset.defaultCharset());
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
        } catch (NoSuchAlgorithmException | ParseException | KeyManagementException | KeyStoreException | IOException e) {
            LOG.error(e.getMessage(), e);
            throw new InternalAuthenticationServiceException(e.getMessage());
        }
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }
}
