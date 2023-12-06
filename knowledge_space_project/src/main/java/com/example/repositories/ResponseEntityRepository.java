package com.example.repositories;

import com.example.model.entity.ResponseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResponseEntityRepository extends JpaRepository<ResponseEntity, Integer> {}
