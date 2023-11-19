package com.example.model.response.auth;

import com.example.model.enumeration.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

  private Integer id;
  private String email;
  private Role role;
  private String token;
  private String refreshToken;
}
