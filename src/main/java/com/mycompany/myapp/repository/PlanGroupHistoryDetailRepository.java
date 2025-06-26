package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PlanGroupHistory;
import com.mycompany.myapp.domain.PlanGroupHistoryDetail;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanGroupHistoryDetailRepository extends JpaRepository<PlanGroupHistoryDetail, Long> {
    List<PlanGroupHistoryDetail> findAllByPlanGroupHistoryId(Long id);

    List<PlanGroupHistoryDetail> findAllByReportId(Long reportId);

    List<PlanGroupHistoryDetail> findAllByReportIdIn(List<Long> reportIds);

    List<PlanGroupHistoryDetail> findAllByPlanGroupHistoryIdAndReportId(Long planGroupHistoryId, Long reportId);
}
