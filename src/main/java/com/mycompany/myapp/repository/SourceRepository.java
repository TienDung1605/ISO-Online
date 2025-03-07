package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Source;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Source entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SourceRepository extends JpaRepository<Source, Long> {
    @Query(value = "SELECT table_name \n" + "FROM information_schema.tables\n" + "WHERE table_schema = 'iso'", nativeQuery = true)
    public List<String> getAllTables();
}
