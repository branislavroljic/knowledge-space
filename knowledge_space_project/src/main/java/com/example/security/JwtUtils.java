package com.example.security;

import com.example.model.entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.util.Date;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Service;


@Data
@Service
@RequiredArgsConstructor
public class JwtUtils {

  private final JwtConfig jwtConfig;

  public String generateJwt(UserEntity user) {

    return Jwts.builder()
        .setId(user.getId().toString())
        .setSubject(user.getEmail())
        .claim("role", user.getRole().name())
        .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getTokenExpirationTime()))
        .signWith(jwtConfig.getHmacKey())
        .compact();
  }

  public String generateRefresh(UserEntity user) {
    return Jwts.builder()
        .setSubject(user.getEmail())
        .setExpiration(
            new Date(System.currentTimeMillis() + jwtConfig.getRefreshTokenExpirationTime()))
        .signWith(jwtConfig.getHmacKey())
        .compact();
  }

  public Claims getClaimsFromJwtToken(String token) {
    try {
      return Jwts.parserBuilder().setSigningKey(jwtConfig.getHmacKey()).build()
          .parseClaimsJws(token).getBody();
    } catch (Exception ex) {
      throw new AuthenticationCredentialsNotFoundException("JWT was expired or incorrect");
    }
  }
}
