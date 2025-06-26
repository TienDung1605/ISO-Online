package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.PlanGroupHistory;
import com.mycompany.myapp.domain.PlanGroupHistoryDetail;
import com.mycompany.myapp.repository.PlanGroupHistoryDetailRepository;
import com.mycompany.myapp.repository.ReportRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/plan-group-history-detail")
//@Transactional
public class PlanGroupHistoryDetailResource {

    @Autowired
    private PlanGroupHistoryDetailRepository planGroupHistoryDetailRepository;

    @Autowired
    private ReportRepository reportRepository;

    @GetMapping("/{id}")
    public List<PlanGroupHistoryDetail> getAllByPlanGroupHistoryId(@PathVariable Long id) {
        return this.planGroupHistoryDetailRepository.findAllByPlanGroupHistoryId(id);
    }

    @PostMapping("")
    public ResponseEntity<?> createData(@RequestBody List<PlanGroupHistoryDetail> newData) {
        try {
            for (PlanGroupHistoryDetail item : newData) {
                this.planGroupHistoryDetailRepository.save(item);
            }
            Map<String, String> response = new HashMap<>();
            response.put("message", "Thành công !");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Có lỗi xảy ra: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/by-report-id/{reportId}")
    public ResponseEntity<List<PlanGroupHistoryDetail>> getAllByReportId(@PathVariable Long reportId) {
        List<PlanGroupHistoryDetail> result = planGroupHistoryDetailRepository.findAllByReportId(reportId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/by-plan-id/{planId}")
    public ResponseEntity<List<PlanGroupHistoryDetail>> getAllByPlanId(@PathVariable Long planId) {
        List<Long> reportIds = reportRepository.findByPlanId(planId).stream().map(report -> report.getId()).collect(Collectors.toList());
        List<PlanGroupHistoryDetail> result = planGroupHistoryDetailRepository.findAllByReportIdIn(reportIds);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/by-history-and-report")
    public ResponseEntity<List<PlanGroupHistoryDetail>> getDetailsByHistoryAndReport(
        @RequestParam("historyId") Long historyId,
        @RequestParam("reportId") Long reportId
    ) {
        List<PlanGroupHistoryDetail> result = planGroupHistoryDetailRepository.findAllByPlanGroupHistoryIdAndReportId(historyId, reportId);
        return ResponseEntity.ok(result);
    }
}
