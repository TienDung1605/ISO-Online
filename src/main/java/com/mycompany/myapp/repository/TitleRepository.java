package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Title;
import com.mycompany.myapp.service.dto.TitleResponse;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Title entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TitleRepository extends JpaRepository<Title, Long> {
    @Query(
        value = "SELECT\n" +
        "tt.id as id\n" +
        ",tt.name as name\n" +
        ",tt.source as source\n" +
        ",tt.data_type as data_type\n" +
        ",tt.field as field\n" +
        ",s.source as source_table\n" +
        ",f.field_name as field_name\n" +
        "FROM `title` tt\n" +
        "inner join iso.source as s on s.name = tt.source\n" +
        "inner join iso.fields as f on f.name = tt.field; ",
        nativeQuery = true
    )
    public List<TitleResponse> getAllTitles();
}
