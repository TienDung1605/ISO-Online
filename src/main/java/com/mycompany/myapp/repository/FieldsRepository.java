package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Fields;
import com.mycompany.myapp.service.dto.FieldsDTO;
import com.mycompany.myapp.service.dto.FieldsRespone;
import java.util.List;
import java.util.Objects;
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
        "    ,s.name as source\n" +
        " FROM `fields` as f \n" +
        " inner join iso.source as s on s.id = f.source_id ; ",
        nativeQuery = true
    )
    public List<FieldsRespone> getAllListFields();

    @Query(
        value = "SELECT \n" +
        "    COLUMN_NAME, \n" +
        "    DATA_TYPE \n" +
        "FROM \n" +
        "    INFORMATION_SCHEMA.COLUMNS \n" +
        "WHERE \n" +
        "    TABLE_NAME = ?1 ;",
        nativeQuery = true
    )
    public List<Object> getAllFieldInfo(String name);
}
