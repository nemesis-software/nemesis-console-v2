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
package io.nemesis.console.backend.storefront;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.nemesis.console.backend.core.NemesisUrlResolver;
import io.nemesis.console.backend.core.impl.NemesisWebAuthenticationDetails;
import org.apache.hc.client5.http.async.methods.SimpleHttpRequest;
import org.apache.hc.client5.http.async.methods.SimpleHttpRequests;
import org.apache.hc.client5.http.async.methods.SimpleHttpResponse;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.async.CloseableHttpAsyncClient;
import org.apache.hc.client5.http.impl.async.HttpAsyncClients;
import org.apache.hc.client5.http.impl.nio.PoolingAsyncClientConnectionManager;
import org.apache.hc.client5.http.impl.nio.PoolingAsyncClientConnectionManagerBuilder;
import org.apache.hc.client5.http.ssl.ClientTlsStrategyBuilder;
import org.apache.hc.client5.http.ssl.NoopHostnameVerifier;
import org.apache.hc.core5.http.ssl.TLS;
import org.apache.hc.core5.http2.HttpVersionPolicy;
import org.apache.hc.core5.pool.PoolConcurrencyPolicy;
import org.apache.hc.core5.pool.PoolReusePolicy;
import org.apache.hc.core5.ssl.SSLContexts;
import org.apache.hc.core5.util.TimeValue;
import org.apache.hc.core5.util.Timeout;
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
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * @author Petar Tahchiev
 * @since 0.6
 */
public class DefaultRestAuthenticationProvider implements AuthenticationProvider {

    protected final Logger LOG = LogManager.getLogger(getClass());

    private NemesisUrlResolver urlResolver;

    public DefaultRestAuthenticationProvider(final NemesisUrlResolver urlResolver) {
        this.urlResolver = urlResolver;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        final String username = (String) authentication.getPrincipal();
        final String password = (String) authentication.getCredentials();

        NemesisWebAuthenticationDetails details = (NemesisWebAuthenticationDetails) authentication.getDetails();
        String restBaseUrl = urlResolver.getNemesisRestBaseUrl(details.getXForwardedFor());

        try {
            // Trust standard CA and those trusted by our custom strategy
            final SSLContext sslcontext = SSLContexts.custom().loadTrustMaterial((chain, authType) -> true).build();

            int timeout = 15;

            PoolingAsyncClientConnectionManager ccm = PoolingAsyncClientConnectionManagerBuilder.create().setTlsStrategy(ClientTlsStrategyBuilder.create()
                                                                                                                                                 .setSslContext(sslcontext)
                                                                                                                                                 .setTlsVersions(TLS.V_1_2)
                                                                                                                                                 .setHostnameVerifier(
                                                                                                                                                                 NoopHostnameVerifier.INSTANCE)
                                                                                                                                                 .build())
                                                                                                .setMaxConnTotal(10)
                                                                                                .setPoolConcurrencyPolicy(PoolConcurrencyPolicy.LAX)
                                                                                                .setConnPoolPolicy(PoolReusePolicy.LIFO)
                                                                                                .setConnectionTimeToLive(TimeValue.ofMinutes(1L)).build();

            try (CloseableHttpAsyncClient httpclient = HttpAsyncClients.custom().setConnectionManager(ccm).setDefaultRequestConfig(
                            RequestConfig.custom().setConnectTimeout(Timeout.ofSeconds(timeout)).setResponseTimeout(Timeout.ofSeconds(timeout))
                                         .setCookieSpec("STANDARD_STRICT").build()).setVersionPolicy(HttpVersionPolicy.FORCE_HTTP_1).build()) {

                httpclient.start();


                /*
                 * It can't be POST because the CSRF is triggered.
                 */
                SimpleHttpRequest httpGet = SimpleHttpRequests.get(restBaseUrl + "auth");

                LOG.info("Calling: " + restBaseUrl + "auth");

                httpGet.setHeader("X-Nemesis-Username", username);
                httpGet.setHeader("X-Nemesis-Password", password);

                Future<SimpleHttpResponse> future = httpclient.execute(httpGet, null);

                SimpleHttpResponse response = future.get(timeout, TimeUnit.SECONDS);

                final String responseText = response.getBody().getBodyText();
                ObjectMapper mapper = new ObjectMapper();
                mapper.configure(JsonParser.Feature.AUTO_CLOSE_SOURCE, true);
                mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                UserData userData = mapper.readValue(responseText, UserData.class);
                if (userData.getToken() == null) {
                    throw new BadCredentialsException("Invalid username/password");
                }

                final ConsoleUserPrincipal principal =
                                new ConsoleUserPrincipal(userData.getUsername(), password, AuthorityUtils.createAuthorityList(userData.getAuthorities()));
                principal.setExpiryTime(userData.getExpiryTime());
                principal.setToken(userData.getToken());

                httpclient.awaitShutdown(TimeValue.of(5, TimeUnit.SECONDS));

                return new UsernamePasswordAuthenticationToken(principal, password, principal.getAuthorities());
            }
        } catch (NoSuchAlgorithmException | InterruptedException | TimeoutException | ExecutionException | KeyManagementException | KeyStoreException | IOException e) {
            LOG.error(e.getMessage(), e);
            throw new InternalAuthenticationServiceException(e.getMessage());
        }
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }
}
