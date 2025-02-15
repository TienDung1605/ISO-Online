package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Report;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Report entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    public List<Report> findAllByPlanId(Long planId);
}
