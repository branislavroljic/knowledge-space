package com.example.model.entity;

import jakarta.persistence.Column;
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
@Table(name = "problem")
public class ProblemEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String name;

  @Column(name = "positionX")
  private Double positionX;

  @Column(name = "positionY")
  private Double positionY;

  @ManyToOne
  @JoinColumn(name = "knowledge_space_id")
  private KnowledgeSpaceEntity knowledgeSpace;
}
