package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ReportTitle;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ReportTitle entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReportTitleRepository extends JpaRepository<ReportTitle, Long> {}
