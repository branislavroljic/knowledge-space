package com.example.security;

import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import jakarta.validation.constraints.NotNull;
import java.security.Key;
import java.util.Base64;
import javax.crypto.spec.SecretKeySpec;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "authorization")
public class JwtConfig {

  @NotNull private String bcryptPrefix;

  @NotNull
  @Value("${authorization.token.header.name}")
  private String tokenHeaderName;

  @NotNull
  @Value("${authorization.token.header.prefix}")
  private String tokenHeaderPrefix;

  @NotNull
  @Value("${authorization.token.secret}")
  private String tokenSecret;

  @NotNull
  @Value("${authorization.token.expirationTime}")
  private Integer tokenExpirationTime;

  @NotNull
  @Value("${authorization.refresh-token.expirationTime}")
  private Integer refreshTokenExpirationTime;

  private Key hmacKey;

  @PostConstruct
  public void init() {

    hmacKey =
        new SecretKeySpec(
            Base64.getDecoder().decode(tokenSecret), SignatureAlgorithm.HS512.getJcaName());
  }
}
