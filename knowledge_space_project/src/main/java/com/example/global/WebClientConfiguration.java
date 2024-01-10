package com.example.global;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfiguration {

  private static final String flaskEndpointUrl = "http://127.0.0.1:5000";

  @Bean
  public WebClient webClient() {

    return WebClient.builder()
        .baseUrl(flaskEndpointUrl)
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build();
  }
}
