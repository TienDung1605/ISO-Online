package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Plan;
import com.mycompany.myapp.domain.PlanGroupHistory;
import com.mycompany.myapp.repository.PlanGroupHistoryRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api/plan-group-history")
@Transactional
public class PlanGroupHistoryResource {

    private final Logger log = LoggerFactory.getLogger(PlanGroupHistoryResource.class);

    private static final String ENTITY_NAME = "planGroupHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    private PlanGroupHistoryRepository planGroupHistoryRepository;

    @GetMapping("")
    public List<PlanGroupHistory> getAllPlanGroups() {
        return planGroupHistoryRepository.findAll();
    }

    // Get danh sach ke hoach hop theo ke hoach
    @GetMapping("/{id}")
    public List<PlanGroupHistory> getAllByPlainId(@PathVariable Long id) {
        return this.planGroupHistoryRepository.findAllByPlanId(id);
    }

    @PostMapping("")
    public ResponseEntity<?> createData(@RequestBody PlanGroupHistory newData) {
        try {
            this.planGroupHistoryRepository.save(newData);
            return ResponseEntity.status(HttpStatus.CREATED).body(newData.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @GetMapping("/by-report-id/{reportId}")
    public ResponseEntity<List<PlanGroupHistory>> getAllByReportId(@PathVariable Long reportId) {
        List<PlanGroupHistory> result = planGroupHistoryRepository.findAllByReportId(reportId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return planGroupHistoryRepository
            .findById(id)
            .<ResponseEntity<?>>map(record -> ResponseEntity.ok(record))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bản ghi với id = " + id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable("id") Long id) {
        log.debug("REST request to delete Plan : {}", id);
        planGroupHistoryRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
