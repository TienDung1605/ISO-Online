package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Fields;
import com.mycompany.myapp.service.dto.FieldsDTO;
import com.mycompany.myapp.service.dto.FieldsRespone;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Fields entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FieldsRepository extends JpaRepository<Fields, Long> {
    @Query(
        value = "SELECT \n" +
        "\tf.id as id\n" +
        "    ,f.name as name\n" +
        "    ,f.field_name as field_name\n" +
        "    ,f.source_id as source_id\n" +
        "    ,f.created_at as created_at\n" +
        "    ,f.updated_at as updated_at\n" +
        "    ,f.create_by as create_by\n" +
        "    ,s.name as source\n" +
        " FROM `fields` as f\n" +
        "inner join iso.source as s on s.id = f.source_id;",
        nativeQuery = true
    )
    public List<FieldsRespone> getAllListFields();
}
