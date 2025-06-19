package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.RemediationPlanDetail;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RemediationPlanDetailRepository extends JpaRepository<RemediationPlanDetail, Long> {
    public List<RemediationPlanDetail> findAllByRemediationPlanId(Long id);

    @Query(
        value = """
        SELECT rpd.*
        FROM remediation_plan_detail rpd
        JOIN remediation_plan rp ON rpd.remediation_plan_id = rp.id
        WHERE rp.report_id = :reportId
        """,
        nativeQuery = true
    )
    List<RemediationPlanDetail> findAllByReportId(@Param("reportId") Long reportId);
}
