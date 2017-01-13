package com.nemesis.console.backend.storefront;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * A filter that will provide a cookie with the server time
 * to the client.
 *
 * @version $Id$
 */
public class SessionTimeoutCookieFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest httpReq, HttpServletResponse httpResponse, FilterChain filterChain) throws ServletException, IOException {
        long currTime = System.currentTimeMillis();
        long expiryTime = currTime + httpReq.getSession().getMaxInactiveInterval() * 1000;
        Cookie cookie = new Cookie("serverTime", "" + currTime);
        cookie.setPath("/");
        httpResponse.addCookie(cookie);
        if (isUserLoggedOut()) {
            cookie = new Cookie("sessionExpiry", "" + currTime);
        } else {
            cookie = new Cookie("sessionExpiry", "" + expiryTime);
        }
        cookie.setPath("/");
        httpResponse.addCookie(cookie);
        filterChain.doFilter(httpReq, httpResponse);
    }

    protected boolean isUserLoggedOut() {
        return SecurityContextHolder.getContext().getAuthentication() == null || "anonymous".equals(SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }
}
