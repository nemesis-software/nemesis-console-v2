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
package io.nemesis.console.backend.core;

/**
 * @author Petar Tahchiev
 * @since 2.2.2
 */
public interface NemesisUrlResolver {

    String NAME = "nemesisUrlResolver";

    String getNemesisRestBaseUrl(String host);

    String getNemesisActuatorBaseUrl(String host);

    String getNemesisWebsiteBaseUrl(String host);
}
