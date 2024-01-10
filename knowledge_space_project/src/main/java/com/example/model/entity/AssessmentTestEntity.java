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
@Table(name = "assessment_test")
public class AssessmentTestEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String name;

  @ManyToOne
  @JoinColumn(name = "knowledge_space_id")
  private KnowledgeSpaceEntity knowledgeSpace;

  @JsonIgnore
  @OneToMany(fetch = FetchType.LAZY, mappedBy = "assessmentTest", cascade = CascadeType.ALL)
  private List<AssessmentTestQuestionEntity> questions;
}
