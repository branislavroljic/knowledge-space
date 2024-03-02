package com.example.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "knowledge_space")
public class KnowledgeSpaceEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String name;

  private Boolean isReal;

  @OneToOne
  @JoinColumn(name = "assessment_test_id")
  private AssessmentTestEntity assessmentTest;
//
//  @JsonIgnore
//  @OneToMany(fetch = FetchType.LAZY, mappedBy = "knowledgeSpace", cascade = CascadeType.ALL)
//  private List<ProblemEntity> problems;
}
