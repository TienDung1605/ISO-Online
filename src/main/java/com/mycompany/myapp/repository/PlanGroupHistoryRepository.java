package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PlanGroupHistory;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanGroupHistoryRepository extends JpaRepository<PlanGroupHistory, Long> {
    public List<PlanGroupHistory> findAllByPlanId(Long planId);

    @Query(
        "SELECT pgh FROM PlanGroupHistory pgh " +
        "WHERE pgh.id IN (" +
        "   SELECT DISTINCT pghd.planGroupHistoryId " +
        "   FROM PlanGroupHistoryDetail pghd " +
        "   WHERE pghd.reportId = :reportId" +
        ")"
    )
    List<PlanGroupHistory> findAllByReportId(@Param("reportId") Long reportId);
}
