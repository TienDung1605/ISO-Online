package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.InspectionReportTitles;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the InspectionReportTitles entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InspectionReportTitlesRepository extends JpaRepository<InspectionReportTitles, Long> {}
