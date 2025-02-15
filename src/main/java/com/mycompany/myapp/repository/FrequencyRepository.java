package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Frequency;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Frequency entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FrequencyRepository extends JpaRepository<Frequency, Long> {}
