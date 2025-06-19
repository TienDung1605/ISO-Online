package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.RecheckRemediationPlanDetail;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RecheckRemediationPlanDetailRepository extends JpaRepository<RecheckRemediationPlanDetail, Long> {
    public List<RecheckRemediationPlanDetail> findAllByRemediationPlanDetailId(Long id);

    @Query(
        value = """
        SELECT rrpd.*
        FROM recheck_remediation_plan_detail rrpd
        JOIN remediation_plan_detail rpd ON rrpd.remediation_plan_detail_id = rpd.id
        JOIN remediation_plan rp ON rpd.remediation_plan_id = rp.id
        WHERE rp.report_id = :reportId
        """,
        nativeQuery = true
    )
    List<RecheckRemediationPlanDetail> findAllByReportId(@Param("reportId") Long reportId);
}
