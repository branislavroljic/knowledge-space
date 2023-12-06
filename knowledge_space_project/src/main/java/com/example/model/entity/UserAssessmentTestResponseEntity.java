package com.example.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "user_assessment_test_response")
public class UserAssessmentTestResponseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "response_id")
  private ResponseEntity response;

  @ManyToOne
  @JoinColumn(name = "user_assessment_test_id")
  private UserAssessmentTestEntity userAssessmentTest;
}
