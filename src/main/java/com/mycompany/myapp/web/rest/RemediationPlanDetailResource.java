package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.PlanGroupHistoryDetail;
import com.mycompany.myapp.domain.RemediationPlanDetail;
import com.mycompany.myapp.repository.RemediationPlanDetailRepository;
import com.mycompany.myapp.repository.RemediationPlanRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/remediation-plan-detail")
@Transactional
public class RemediationPlanDetailResource {

    @Autowired
    private RemediationPlanDetailRepository remediationPlanDetailRepository;

    @GetMapping("/{id}")
    public List<RemediationPlanDetail> getAllByRemediationPlanId(@PathVariable Long id) {
        return this.remediationPlanDetailRepository.findAllByRemediationPlanId(id);
    }

    @PostMapping("")
    public ResponseEntity<?> createData(@RequestBody List<RemediationPlanDetail> newData) {
        try {
            for (RemediationPlanDetail item : newData) {
                this.remediationPlanDetailRepository.save(item);
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

    @GetMapping("/by-report/{reportId}")
    public ResponseEntity<List<RemediationPlanDetail>> getByReportId(@PathVariable Long reportId) {
        List<RemediationPlanDetail> result = remediationPlanDetailRepository.findAllByReportId(reportId);
        return ResponseEntity.ok().body(result);
    }
}
