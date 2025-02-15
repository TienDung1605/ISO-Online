package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CriteriaGroup;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CriteriaGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CriteriaGroupRepository extends JpaRepository<CriteriaGroup, Long> {}
