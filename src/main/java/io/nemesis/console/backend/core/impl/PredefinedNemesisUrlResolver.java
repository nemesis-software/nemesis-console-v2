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

import io.nemesis.console.backend.config.ConsoleProperties;
import io.nemesis.console.backend.core.NemesisUrlResolver;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author Petar Tahchiev
 * @since 2.2.2
 */
public class PredefinedNemesisUrlResolver implements NemesisUrlResolver {

    public static final String NAME = "predefinedNemesisUrlResolver";

    @Autowired
    private ConsoleProperties consoleProperties;

    @Override
    public String getNemesisRestBaseUrl(String host) {
        return consoleProperties.getRestBaseUrl();
    }

    @Override
    public String getNemesisActuatorBaseUrl(String host) {
        return consoleProperties.getActuatorBaseUrl();
    }

    @Override
    public String getNemesisWebsiteBaseUrl(String host) {
        return consoleProperties.getWebsiteBaseUrl();
    }
}
