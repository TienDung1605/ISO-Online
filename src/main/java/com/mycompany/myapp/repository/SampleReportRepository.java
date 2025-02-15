package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.SampleReport;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SampleReport entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SampleReportRepository extends JpaRepository<SampleReport, Long> {}
