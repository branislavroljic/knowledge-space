package com.example.model.entity;

import com.example.model.enumeration.Role;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "User", schema = "public")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserEntity {

  @Id @GeneratedValue private Integer id;

  @Column(unique = true)
  private String email;

  private String password;

  @Enumerated(EnumType.ORDINAL)
  private Role role;
}
