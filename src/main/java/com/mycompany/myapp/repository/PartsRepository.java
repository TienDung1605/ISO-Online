package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Parts;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Parts entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PartsRepository extends JpaRepository<Parts, Long> {}
