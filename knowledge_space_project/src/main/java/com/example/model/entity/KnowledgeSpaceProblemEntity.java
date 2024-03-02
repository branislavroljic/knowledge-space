package com.example.model.entity;

import jakarta.persistence.CascadeType;
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
@Table(name = "knowledge_space_problem")
public class KnowledgeSpaceProblemEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "knowledge_space_id")
  private KnowledgeSpaceEntity knowledgeSpace;

  @ManyToOne
  @JoinColumn(name = "problem_id")
  private ProblemEntity problem;
}
