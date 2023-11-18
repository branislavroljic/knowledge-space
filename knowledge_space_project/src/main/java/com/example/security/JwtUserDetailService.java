package com.example.security;

import com.example.mapper.UserMapper;
import com.example.model.exception.NotFoundException;
import com.example.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtUserDetailService implements UserDetailsService {

  private final UserEntityRepository userEntityRepository;
  private final UserMapper userMapper;

  @Override
  public JwtUser loadUserByUsername(String email)
      throws org.springframework.security.core.userdetails.UsernameNotFoundException {

    return userMapper.mapUserEntityToJwtUser(
        userEntityRepository.findByEmail(email).orElseThrow(NotFoundException::new));
  }
}
