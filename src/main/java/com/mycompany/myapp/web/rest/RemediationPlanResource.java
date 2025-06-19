package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.RemediationPlan;
import com.mycompany.myapp.repository.RemediationPlanRepository;
import java.util.List;
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
@RequestMapping("/api/remediation-plan")
@Transactional
public class RemediationPlanResource {

    private final Logger log = LoggerFactory.getLogger(RemediationPlanResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String ENTITY_NAME = "remediationPlan";

    @Autowired
    private RemediationPlanRepository remediationPlanRepository;

    @GetMapping("")
    public List<RemediationPlan> getAllRemediationPlan() {
        return remediationPlanRepository.findAll();
    }

    //    Lấy list danh sách theo reportId
    @GetMapping("/{id}")
    public List<RemediationPlan> getAllByReportId(@PathVariable Long id) {
        return this.remediationPlanRepository.findAllByReportId(id);
    }

    @GetMapping("/plan-id/{id}")
    public List<RemediationPlan> getAllByPlanId(@PathVariable Long id) {
        return this.remediationPlanRepository.findAllByPlanId(id);
    }

    @PostMapping("")
    public ResponseEntity<?> createData(@RequestBody RemediationPlan newData) {
        try {
            this.remediationPlanRepository.save(newData);
            return ResponseEntity.status(HttpStatus.CREATED).body(newData.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRemediationPlan(@PathVariable("id") Long id) {
        log.debug("REST request to delete Plan : {}", id);
        remediationPlanRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/get-all/{planId}/{reportId}")
    public List<RemediationPlan> getAllByPlanIdAndReportId(@PathVariable Long planId, @PathVariable Long reportId) {
        return remediationPlanRepository.findAllByPlanIdAndReportId(planId, reportId);
    }
}
