package com.example.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class KSFlaskService {

  private final WebClient webClient;

  public Mono<int[][]> getIITAImplications(int[][] matrix) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    return webClient
        .post()
        .uri("/iita")
        .contentType(MediaType.APPLICATION_JSON)
        .body(BodyInserters.fromValue(matrix))
        .retrieve()
        .bodyToMono(int[][].class);
  }
}
