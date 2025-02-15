package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ReportCriteria;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ReportCriteria entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReportCriteriaRepository extends JpaRepository<ReportCriteria, Long> {}
