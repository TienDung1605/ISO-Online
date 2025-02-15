package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CheckerGroup;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CheckerGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CheckerGroupRepository extends JpaRepository<CheckerGroup, Long> {}
