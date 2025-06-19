package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.RecheckRemediationPlanDetail;
import com.mycompany.myapp.domain.RemediationPlan;
import com.mycompany.myapp.domain.RemediationPlanDetail;
import com.mycompany.myapp.repository.RecheckRemediationPlanDetailRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api/recheck-remediation-plan-detail")
@Transactional
public class RecheckRemediationPlanDetailResource {

    private final Logger log = LoggerFactory.getLogger(RecheckRemediationPlanDetailResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String ENTITY_NAME = "recheckRemediationPlanDetail";

    @Autowired
    private RecheckRemediationPlanDetailRepository recheckRemediationPlanDetailRepository;

    @GetMapping("")
    public List<RecheckRemediationPlanDetail> getAllRecheckRemediationPlanDetail() {
        return this.recheckRemediationPlanDetailRepository.findAll();
    }

    @GetMapping("/{id}")
    public List<RecheckRemediationPlanDetail> getAllByRemediationPlanDetaiId(@PathVariable Long id) {
        return this.recheckRemediationPlanDetailRepository.findAllByRemediationPlanDetailId(id);
    }

    @PostMapping("")
    public ResponseEntity<?> createData(@RequestBody List<RecheckRemediationPlanDetail> newData) {
        try {
            for (RecheckRemediationPlanDetail item : newData) {
                this.recheckRemediationPlanDetailRepository.save(item);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRemediationPlan(@PathVariable("id") Long id) {
        log.debug("REST request to delete Plan : {}", id);
        recheckRemediationPlanDetailRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/by-report/{reportId}")
    public ResponseEntity<List<RecheckRemediationPlanDetail>> getAllByReportId(@PathVariable Long reportId) {
        List<RecheckRemediationPlanDetail> details = recheckRemediationPlanDetailRepository.findAllByReportId(reportId);
        return ResponseEntity.ok(details);
    }
}
