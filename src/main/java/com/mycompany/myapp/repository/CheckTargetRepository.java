package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CheckTarget;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CheckTarget entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CheckTargetRepository extends JpaRepository<CheckTarget, Long> {}
