package com.nemesis.console.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Petar Tahchiev
 * @since 1.0
 */
@ConfigurationProperties(prefix = "console")
public class ConsoleProperties {

    private String restBaseUrl;

    private String websiteBaseUrl;

    /* getters/setters */

    public String getRestBaseUrl() {
        return restBaseUrl;
    }

    public void setRestBaseUrl(String restBaseUrl) {
        this.restBaseUrl = restBaseUrl;
    }

    public String getWebsiteBaseUrl() {
        return websiteBaseUrl;
    }

    public void setWebsiteBaseUrl(String websiteBaseUrl) {
        this.websiteBaseUrl = websiteBaseUrl;
    }
}
