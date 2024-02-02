package com.example.repositories;

import com.example.model.dto.Report;
import com.example.model.entity.AssessmentTestEntity;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AssessmentTestEntityRepository
    extends JpaRepository<AssessmentTestEntity, Integer> {

  Page<AssessmentTestEntity> findAllByKnowledgeSpaceId(Integer id, Pageable pageable);

  List<AssessmentTestEntity> findAllByKnowledgeSpaceId(Integer id);

  @Query(nativeQuery = true, value =
      "WITH CorrectResponses AS (" +
          "    SELECT " +
          "        uat.id AS user_assessment_test_id, " +
          "        q.problem_id, " +
          "        COUNT(*) AS correct_responses_count " +
          "    FROM " +
          "        public.user_assessment_test uat " +
          "        JOIN public.user_assessment_test_response uatr ON uat.id = uatr.user_assessment_test_id " +
          "        JOIN public.response r ON uatr.response_id = r.id AND r.correct = true " +
          "        JOIN public.question q ON r.question_id = q.id " +
          "    WHERE " +
          "        uat.assessment_test_id = :assessmentTestId " +
          "    GROUP BY " +
          "        uat.id, q.problem_id " +
          ") " +
          "SELECT " +
          "    p.name AS xvalue, " +
          "    COALESCE(SUM(cr.correct_responses_count), 0) AS yvalue " +
          "FROM " +
          "    public.problem p " +
          "    LEFT JOIN CorrectResponses cr ON p.id = cr.problem_id " +
          "GROUP BY " +
          "    p.id " +
          "ORDER BY " +
          "    p.id")
  List<Report> getStatistics(@Param("assessmentTestId") Integer assessmentTestId);
}
