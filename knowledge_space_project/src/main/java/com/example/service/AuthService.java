package com.example.service;

import com.example.mapper.UserMapper;
import com.example.model.entity.UserEntity;
import com.example.model.exception.EmailNotFoundException;
import com.example.model.exception.NotFoundException;
import com.example.model.request.auth.LoginRequest;
import com.example.model.request.auth.RefreshTokenRequest;
import com.example.model.response.auth.LoginResponse;
import com.example.model.response.auth.RefreshTokenResponse;
import com.example.repositories.UserEntityRepository;
import com.example.security.JwtConfig;
import com.example.security.JwtUser;
import com.example.security.JwtUtils;
import io.jsonwebtoken.Claims;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

  private final MessageSource ms;
  private final UserEntityRepository userEntityRepository;
  private final UserMapper userMapper;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtUtils jwtUtils;
  private final JwtConfig jwtConfig;

  public LoginResponse login(LoginRequest loginRequest) {
    LoginResponse response;
    try {
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  loginRequest.getEmail(), loginRequest.getPassword()));
      JwtUser jwtUser = (JwtUser) authentication.getPrincipal();

      UserEntity userEntity =
          userEntityRepository.findById(jwtUser.getId()).orElseThrow(NotFoundException::new);

      response = userMapper.mapUserEntityToLoginResponse(userEntity);
      response.setToken(jwtUtils.generateJwt(userEntity));
      response.setRefreshToken(jwtUtils.generateRefresh(userEntity));

    } catch (Exception e) {
      log.error(String.format("An error occurred while performing action: %s", e.getMessage()));
      throw new NotFoundException("Email or password are not valid");
    }
    return response;
  }

  public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
    // get refresh token
    String refreshToken = request.getRefreshToken();
    Claims claims = jwtUtils.getClaimsFromJwtToken(refreshToken);

    // get user from claims
    UserEntity user =
        userEntityRepository
            .findByEmail(claims.getSubject())
            .orElseThrow(EmailNotFoundException::new);

    // generate new JWT
    String jwt = jwtUtils.generateJwt(user);

    RefreshTokenResponse response = new RefreshTokenResponse();
    response.setJwtToken(jwt);
    return response;
  }
}
