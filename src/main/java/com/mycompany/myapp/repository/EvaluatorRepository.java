package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Evaluator;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Evaluator entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EvaluatorRepository extends JpaRepository<Evaluator, Long> {}
