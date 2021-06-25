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

import io.nemesis.console.backend.core.NemesisUrlResolver;

/**
 * @author Petar Tahchiev
 * @since 2.2.2
 */
public class DynamicNemesisUrlResolver implements NemesisUrlResolver {

    public static final String NAME = "dynamicNemesisUrlResolver";

    @Override
    public String getNemesisRestBaseUrl(String host) {
        return "https://" + host + "/rest/";
    }

    @Override
    public String getNemesisActuatorBaseUrl(String host) {
        return "https://" + host + "/platform/";
    }

    @Override
    public String getNemesisWebsiteBaseUrl(String host) {
        return "https://" + host + "/";
    }
}
