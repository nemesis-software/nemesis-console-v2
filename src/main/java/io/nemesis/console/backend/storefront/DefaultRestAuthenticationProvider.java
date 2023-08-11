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
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactoryBuilder;
import org.apache.hc.core5.http.ClassicHttpRequest;
import org.apache.hc.core5.http.ClassicHttpResponse;
import org.apache.hc.core5.http.ParseException;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.ssl.SSLContexts;
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
import java.net.URI;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;

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
        String restBaseUrl = urlResolver.getNemesisRestBaseUrl(details.getNemesisBaseUrlHost());

        try {
            // Trust standard CA and those trusted by our custom strategy
            final SSLContext sslcontext = SSLContexts.custom().loadTrustMaterial((chain, authType) -> true).build();

            int timeout = 15;

            PoolingHttpClientConnectionManager ccm = PoolingHttpClientConnectionManagerBuilder.create().setSSLSocketFactory(
                SSLConnectionSocketFactoryBuilder.create().setSslContext(sslcontext).build()).build();
            //                .setTlsStrategy(ClientTlsStrategyBuilder.create()
            //                    .setSslContext(sslcontext)
            //                    .setTlsVersions(TLS.V_1_2)
            //                    .setHostnameVerifier(
            //                        NoopHostnameVerifier.INSTANCE)
            //                    .build())
            //                .setConnectionTimeToLive(TimeValue.ofMinutes(1L)).build();

            try (CloseableHttpClient httpclient = HttpClients.custom().setConnectionManager(ccm).setDefaultRequestConfig(RequestConfig.custom().setConnectTimeout(Timeout.ofSeconds(timeout)).setResponseTimeout(Timeout.ofSeconds(timeout)).setCookieSpec("STANDARD_STRICT").build()).build()) {

                //                httpclient.start();


                /*
                 * It can't be POST because the CSRF is triggered.
                 */
                ClassicHttpRequest httpGet = new HttpGet(new URI(restBaseUrl + "auth"));

                LOG.info("Calling: " + restBaseUrl + "auth");

                httpGet.setHeader("X-Nemesis-Username", username);
                httpGet.setHeader("X-Nemesis-Password", password);
                //                httpGet.setHeader("Host", "localhost");
                //httpGet.setHeader(HttpHeaders.CONTENT_LENGTH, "123");

                ClassicHttpResponse future = httpclient.execute(httpGet);

                String responseText = EntityUtils.toString(future.getEntity());//future.get(timeout, TimeUnit.SECONDS);

                //final String responseText = response.getBodyText();
                ObjectMapper mapper = new ObjectMapper();
                mapper.configure(JsonParser.Feature.AUTO_CLOSE_SOURCE, true);
                mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                UserData userData = mapper.readValue(responseText, UserData.class);
                if (userData.getToken() == null) {
                    throw new BadCredentialsException("Invalid username/password");
                }

                final ConsoleUserPrincipal principal = new ConsoleUserPrincipal(userData.getUsername(), password, AuthorityUtils.createAuthorityList(userData.getAuthorities()));
                principal.setExpiryTime(userData.getExpiryTime());
                principal.setToken(userData.getToken());

                //                httpclient.awaitShutdown(TimeValue.of(5, TimeUnit.SECONDS));

                return new UsernamePasswordAuthenticationToken(principal, password, principal.getAuthorities());
            }
        } catch (NoSuchAlgorithmException | KeyManagementException | KeyStoreException | IOException |
                 URISyntaxException | ParseException e) {
            LOG.error(e.getMessage(), e);
            throw new InternalAuthenticationServiceException(e.getMessage());
        }
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }
}
