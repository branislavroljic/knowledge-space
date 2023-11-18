package com.example.security;

import com.example.model.enumeration.Role;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.log.LogMessage;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtRequestHeaderTokenFilter extends OncePerRequestFilter {

  private final Log log = LogFactory.getLog(getClass());
  private final JwtUtils jwtUtils;
  private final JwtConfig jwtConfig;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    try {
      String authorizationHeader = request.getHeader(jwtConfig.getTokenHeaderName());
      log.info("Authorization Header value: " + authorizationHeader);

      if (authorizationHeader == null
          || !authorizationHeader.startsWith(jwtConfig.getTokenHeaderPrefix())) {
        this.log.trace("No Authorization header found!");
        filterChain.doFilter(request, response);
        return;
      }
      String token =
          StringUtils.delete(authorizationHeader, jwtConfig.getTokenHeaderPrefix()).trim();

      Claims claims = jwtUtils.getClaimsFromJwtToken(token);
      this.log.trace(
          LogMessage.format(
              "username '%s' extracted from Bearer Authorization header", claims.getSubject()));

      JwtUser jwtUser =
          new JwtUser(
              Integer.valueOf(claims.getId()),
              claims.getSubject(),
              null,
              Role.valueOf(claims.get("role", String.class)));
      Authentication authentication =
          new UsernamePasswordAuthenticationToken(jwtUser, null, jwtUser.getAuthorities());
      SecurityContextHolder.getContext().setAuthentication(authentication);

      log.info("(Authorized) Authentication: " + authentication);

    } catch (AuthenticationException ex) {
      this.log.info("Failed to process authentication request: " + ex.getMessage());
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      return;
    }

    filterChain.doFilter(request, response);
  }
}
