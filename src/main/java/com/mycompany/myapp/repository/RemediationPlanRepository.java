package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.RemediationPlan;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RemediationPlanRepository extends JpaRepository<RemediationPlan, Long> {
    public List<RemediationPlan> findAllByReportId(Long reportId);

    public List<RemediationPlan> findAllByPlanId(Long planId);

    public List<RemediationPlan> findAllByPlanIdAndReportId(Long planId, Long reportId);
}
