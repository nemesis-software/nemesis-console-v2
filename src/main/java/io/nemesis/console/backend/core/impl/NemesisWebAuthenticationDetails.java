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
package io.nemesis.console.backend.core.impl;

import org.springframework.security.web.authentication.WebAuthenticationDetails;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Petar Tahchiev
 * @since 2.2.2
 */
public class NemesisWebAuthenticationDetails extends WebAuthenticationDetails {

    private HttpServletRequest request;

    /**
     * Records the remote address and will also set the session Id if a session already
     * exists (it won't create one).
     *
     * @param request that the authentication request was received from
     */
    public NemesisWebAuthenticationDetails(HttpServletRequest request) {
        super(request);
        this.request = request;
    }

    public String getNemesisBaseUrlHost() {
        return request.getHeader("X-Nemesis-Base-Url");
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof WebAuthenticationDetails) {
            WebAuthenticationDetails rhs = (WebAuthenticationDetails) obj;

            if (getRemoteAddress() == null && rhs.getRemoteAddress() != null) {
                return false;
            }

            if (getRemoteAddress() != null && rhs.getRemoteAddress() == null) {
                return false;
            }

            if (getRemoteAddress() != null && !getRemoteAddress().equals(rhs.getRemoteAddress())) {
                return false;
            }

            if (getSessionId() == null && rhs.getSessionId() != null) {
                return false;
            }

            if (getSessionId() != null && rhs.getSessionId() == null) {
                return false;
            }

            if (getSessionId() != null && !getSessionId().equals(rhs.getSessionId())) {
                return false;
            }

            return true;
        }

        return false;
    }

    @Override
    public int hashCode() {
        int code = 7654;

        if (getRemoteAddress() != null) {
            code = code * (getRemoteAddress().hashCode() % 7);
        }

        if (getSessionId() != null) {
            code = code * (getSessionId().hashCode() % 7);
        }

        return code;
    }
}
