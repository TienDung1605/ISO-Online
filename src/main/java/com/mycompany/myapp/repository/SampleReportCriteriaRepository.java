package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.SampleReportCriteria;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SampleReportCriteria entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SampleReportCriteriaRepository extends JpaRepository<SampleReportCriteria, Long> {}
