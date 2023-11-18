package com.example.initialization;

import com.example.model.entity.UserEntity;
import com.example.model.enumeration.Role;
import com.example.repositories.UserEntityRepository;
import com.example.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProfessorInitializer implements CommandLineRunner {
  private final UserEntityRepository userEntityRepository;
  private final JwtUtils jwtUtils;

  @Override
  public void run(String... args) {
    if (userEntityRepository.findByEmail("professor@gmail.com").isEmpty()) {
      UserEntity professor = new UserEntity();
      professor.setId(0);
      professor.setEmail("professor@gmail.com");
      professor.setPassword(
          jwtUtils.getJwtConfig().getBcryptPrefix()
              + new BCryptPasswordEncoder().encode("sigurnost"));
      professor.setRole(Role.PROFESSOR);
      userEntityRepository.save(professor);
    }
  }
}
