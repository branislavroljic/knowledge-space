package com.example.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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
//
//  @JsonIgnore
//  @OneToMany(fetch = FetchType.LAZY, mappedBy = "problem", cascade = CascadeType.ALL)
//  private List<KnowledgeSpaceProblemEntity> knowledgeSpaceProblems;
  //
  //  @ManyToOne
  //  @JoinColumn(name = "knowledge_space_id")
  //  private KnowledgeSpaceEntity knowledgeSpace;
}
