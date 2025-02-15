package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ReportType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ReportType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReportTypeRepository extends JpaRepository<ReportType, Long> {}
