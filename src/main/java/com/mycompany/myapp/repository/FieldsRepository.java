package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Fields;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Fields entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FieldsRepository extends JpaRepository<Fields, Long> {}
