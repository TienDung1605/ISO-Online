package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Script;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Script entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ScriptRepository extends JpaRepository<Script, Long> {}
