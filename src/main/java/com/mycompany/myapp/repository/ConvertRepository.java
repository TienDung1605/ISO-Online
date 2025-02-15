package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Convert;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Convert entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConvertRepository extends JpaRepository<Convert, Long> {}
