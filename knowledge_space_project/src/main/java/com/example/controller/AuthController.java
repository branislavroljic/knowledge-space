package com.example.controller;

import com.example.model.request.auth.LoginRequest;
import com.example.model.request.auth.RefreshTokenRequest;
import com.example.model.response.auth.LoginResponse;
import com.example.model.response.auth.RefreshTokenResponse;
import com.example.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
    return ResponseEntity.ok(authService.login(loginRequest));
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<RefreshTokenResponse> refreshToken(
      @RequestBody @Valid RefreshTokenRequest request) {
    return ResponseEntity.ok(authService.refreshToken(request));
  }
}
