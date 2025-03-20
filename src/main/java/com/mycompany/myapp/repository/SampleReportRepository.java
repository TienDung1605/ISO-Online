package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.SampleReport;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SampleReport entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SampleReportRepository extends JpaRepository<SampleReport, Long> {
    @Query(value = "" + " select ?1 from ?2 ;", nativeQuery = true)
    public List<String> getList(String field_name, String source_table);

    @Query(value = "SELECT id,code,name \n" + "FROM iso.sample_report ;", nativeQuery = true)
    public List<Object> getSampleReports();

    @Query(value = "SELECT detail \n" + "FROM iso.sample_report where code = ?1 ;", nativeQuery = true)
    public String getSampleReportDetail(String code);
}
