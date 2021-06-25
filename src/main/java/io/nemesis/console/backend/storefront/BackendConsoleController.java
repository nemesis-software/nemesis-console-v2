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

import io.nemesis.console.backend.core.NemesisUrlResolver;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;

@Controller
public class BackendConsoleController {

    @Resource(name = NemesisUrlResolver.NAME)
    private NemesisUrlResolver nemesisUrlResolver;

    @RequestMapping(value = { "/" }, method = { RequestMethod.GET, RequestMethod.POST })
    public String redirectToAdmin() {
        return "redirect:/admin";
    }

    @RequestMapping(value = { "/admin", "{path:(?!login|media|resources).*$}", "{path:(?!login|media|resources).*$}/**" }, method = RequestMethod.GET)
    public String home(final Model model, final HttpServletRequest request) {
        model.addAttribute("websiteBaseUrl", nemesisUrlResolver.getNemesisWebsiteBaseUrl(request.getRemoteHost()));
        model.addAttribute("actuatorBaseUrl", nemesisUrlResolver.getNemesisActuatorBaseUrl(request.getRemoteHost()));
        model.addAttribute("restBaseUrl", nemesisUrlResolver.getNemesisRestBaseUrl(request.getRemoteHost()));
        return "index";
    }

    @RequestMapping(value = { "/login" }, method = { RequestMethod.GET, RequestMethod.POST })
    public String login() {
        return "login";
    }

    @RequestMapping(value = { "/media/**" }, method = RequestMethod.GET)
    public void media(final HttpServletRequest request, HttpServletResponse response) throws IOException {

        String websiteBaseUrl = nemesisUrlResolver.getNemesisWebsiteBaseUrl(request.getRemoteAddr());

        StringBuilder stringUrl = new StringBuilder(websiteBaseUrl);
        if (!websiteBaseUrl.endsWith("/")) {
            stringUrl.append("/");
        }

        final String mediaUrl =
                        request.getRequestURI().substring(request.getRequestURI().indexOf(request.getContextPath()) + request.getContextPath().length() + 1);

        stringUrl.append(mediaUrl);

        final URL url = new URL(stringUrl.toString());
        final URLConnection uc = url.openConnection();

        response.setContentType(uc.getContentType());
        response.setContentLength(uc.getContentLength());

        IOUtils.copy(uc.getInputStream(), response.getOutputStream());
    }
}
