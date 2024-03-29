package com.example.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import lombok.Data;

@Entity
@Data
@Table(name = "user_assessment_test")
public class UserAssessmentTestEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private UserEntity user;

  @ManyToOne
  @JoinColumn(name = "assessment_test_id")
  private AssessmentTestEntity assessmentTest;

  @JsonIgnore
  @OneToMany(fetch = FetchType.LAZY, mappedBy = "userAssessmentTest", cascade = CascadeType.ALL)
  private List<UserAssessmentTestResponseEntity> responseEntities;
}
