package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Title;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Title entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TitleRepository extends JpaRepository<Title, Long> {}
