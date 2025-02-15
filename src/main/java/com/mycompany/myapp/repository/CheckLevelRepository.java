package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CheckLevel;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CheckLevel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CheckLevelRepository extends JpaRepository<CheckLevel, Long> {}
