package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Plan;
import com.mycompany.myapp.repository.PlanRepository;
import com.mycompany.myapp.repository.ReportRepository;
import com.mycompany.myapp.service.dto.PlanDetailDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Plan}.
 */
@RestController
@RequestMapping("/api/plans")
@Transactional
public class PlanResource {

    private final Logger log = LoggerFactory.getLogger(PlanResource.class);

    private static final String ENTITY_NAME = "plan";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlanRepository planRepository;
    private final ReportRepository reportRepository;

    public PlanResource(PlanRepository planRepository, ReportRepository reportRepository) {
        this.planRepository = planRepository;
        this.reportRepository = reportRepository;
    }

    /**
     * {@code POST  /plans} : Create a new plan.
     *
     * @param plan the plan to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new plan, or with status {@code 400 (Bad Request)} if the plan has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Plan> createPlan(@RequestBody Plan plan) throws URISyntaxException {
        log.debug("REST request to save Plan : {}", plan);
        if (plan.getId() != null) {
            throw new BadRequestAlertException("A new plan cannot already have an ID", ENTITY_NAME, "idexists");
        }
        plan = planRepository.save(plan);
        return ResponseEntity.created(new URI("/api/plans/" + plan.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, plan.getId().toString()))
            .body(plan);
    }

    /**
     * {@code PUT  /plans/:id} : Updates an existing plan.
     *
     * @param id the id of the plan to save.
     * @param plan the plan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plan,
     * or with status {@code 400 (Bad Request)} if the plan is not valid,
     * or with status {@code 500 (Internal Server Error)} if the plan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Plan> updatePlan(@PathVariable(value = "id", required = false) final Long id, @RequestBody Plan plan)
        throws URISyntaxException {
        log.debug("REST request to update Plan : {}, {}", id, plan);
        if (plan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!planRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        plan = planRepository.save(plan);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plan.getId().toString()))
            .body(plan);
    }

    /**
     * {@code PATCH  /plans/:id} : Partial updates given fields of an existing plan, field will ignore if it is null
     *
     * @param id the id of the plan to save.
     * @param plan the plan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plan,
     * or with status {@code 400 (Bad Request)} if the plan is not valid,
     * or with status {@code 404 (Not Found)} if the plan is not found,
     * or with status {@code 500 (Internal Server Error)} if the plan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Plan> partialUpdatePlan(@PathVariable(value = "id", required = false) final Long id, @RequestBody Plan plan)
        throws URISyntaxException {
        log.debug("REST request to partial update Plan partially : {}, {}", id, plan);
        if (plan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!planRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Plan> result = planRepository
            .findById(plan.getId())
            .map(existingPlan -> {
                if (plan.getCode() != null) {
                    existingPlan.setCode(plan.getCode());
                }
                if (plan.getName() != null) {
                    existingPlan.setName(plan.getName());
                }
                if (plan.getSubjectOfAssetmentPlan() != null) {
                    existingPlan.setSubjectOfAssetmentPlan(plan.getSubjectOfAssetmentPlan());
                }
                if (plan.getFrequency() != null) {
                    existingPlan.setFrequency(plan.getFrequency());
                }
                if (plan.getTimeStart() != null) {
                    existingPlan.setTimeStart(plan.getTimeStart());
                }
                if (plan.getTimeEnd() != null) {
                    existingPlan.setTimeEnd(plan.getTimeEnd());
                }
                if (plan.getStatusPlan() != null) {
                    existingPlan.setStatusPlan(plan.getStatusPlan());
                }
                if (plan.getTestObject() != null) {
                    existingPlan.setTestObject(plan.getTestObject());
                }
                if (plan.getReportTypeId() != null) {
                    existingPlan.setReportTypeId(plan.getReportTypeId());
                }
                if (plan.getReportTypeName() != null) {
                    existingPlan.setReportTypeName(plan.getReportTypeName());
                }
                if (plan.getNumberOfCheck() != null) {
                    existingPlan.setNumberOfCheck(plan.getNumberOfCheck());
                }
                if (plan.getImplementer() != null) {
                    existingPlan.setImplementer(plan.getImplementer());
                }
                if (plan.getPaticipant() != null) {
                    existingPlan.setPaticipant(plan.getPaticipant());
                }
                if (plan.getCheckerGroup() != null) {
                    existingPlan.setCheckerGroup(plan.getCheckerGroup());
                }
                if (plan.getCheckerName() != null) {
                    existingPlan.setCheckerName(plan.getCheckerName());
                }
                if (plan.getCheckerGroupId() != null) {
                    existingPlan.setCheckerGroupId(plan.getCheckerGroupId());
                }
                if (plan.getCheckerId() != null) {
                    existingPlan.setCheckerId(plan.getCheckerId());
                }
                if (plan.getGross() != null) {
                    existingPlan.setGross(plan.getGross());
                }
                if (plan.getTimeCheck() != null) {
                    existingPlan.setTimeCheck(plan.getTimeCheck());
                }
                if (plan.getNameResult() != null) {
                    existingPlan.setNameResult(plan.getNameResult());
                }
                if (plan.getScriptId() != null) {
                    existingPlan.setScriptId(plan.getScriptId());
                }
                if (plan.getCreateBy() != null) {
                    existingPlan.setCreateBy(plan.getCreateBy());
                }
                if (plan.getStatus() != null) {
                    existingPlan.setStatus(plan.getStatus());
                }
                if (plan.getCreatedAt() != null) {
                    existingPlan.setCreatedAt(plan.getCreatedAt());
                }
                if (plan.getUpdatedAt() != null) {
                    existingPlan.setUpdatedAt(plan.getUpdatedAt());
                }
                if (plan.getUpdateBy() != null) {
                    existingPlan.setUpdateBy(plan.getUpdateBy());
                }

                return existingPlan;
            })
            .map(planRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plan.getId().toString())
        );
    }

    /**
     * {@code GET  /plans} : get all the plans.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of plans in body.
     */
    @GetMapping("")
    public List<Plan> getAllPlans() {
        log.debug("REST request to get all Plans");
        return planRepository.findAll();
    }

    /**
     * {@code GET  /plans/:id} : get the "id" plan.
     *
     * @param id the id of the plan to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the plan, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Plan> getPlan(@PathVariable("id") Long id) {
        log.debug("REST request to get Plan : {}", id);
        Optional<Plan> plan = planRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(plan);
    }

    /**
     * {@code DELETE  /plans/:id} : delete the "id" plan.
     *
     * @param id the id of the plan to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable("id") Long id) {
        log.debug("REST request to delete Plan : {}", id);
        planRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * Lay du lieu plan di kem thong tin chi tiet
     */
    @GetMapping("plan-detail")
    public List<PlanDetailDTO> getPlanDetail() {
        List<Plan> plans = this.planRepository.findAll();
        List<PlanDetailDTO> planDetailDTOS = new ArrayList<>();
        for (Plan plan : plans) {
            PlanDetailDTO planDetailDTO = new PlanDetailDTO();
            planDetailDTO.setId(plan.getId());
            planDetailDTO.setCode(plan.getCode());
            planDetailDTO.setName(plan.getName());
            planDetailDTO.setSubjectOfAssetmentPlan(plan.getSubjectOfAssetmentPlan());
            planDetailDTO.setFrequency(plan.getFrequency());
            planDetailDTO.setTimeStart(plan.getTimeStart());
            planDetailDTO.setTimeEnd(plan.getTimeEnd());
            planDetailDTO.setStatusPlan(plan.getStatusPlan());
            planDetailDTO.setTestObject(plan.getTestObject());
            planDetailDTO.setReportTypeId(plan.getReportTypeId());
            planDetailDTO.setReportTypeName(plan.getReportTypeName());
            planDetailDTO.setNumberOfCheck(plan.getNumberOfCheck());
            planDetailDTO.setImplementer(plan.getImplementer());
            planDetailDTO.setPaticipant(plan.getPaticipant());
            planDetailDTO.setCheckerGroup(plan.getCheckerGroup());
            planDetailDTO.setCheckerName(plan.getCheckerName());
            planDetailDTO.setCheckerGroupId(plan.getCheckerGroupId());
            planDetailDTO.setCheckerId(plan.getCheckerId());
            planDetailDTO.setGross(plan.getGross());
            planDetailDTO.setTimeCheck(plan.getTimeCheck());
            planDetailDTO.setNameResult(plan.getNameResult());
            planDetailDTO.setScriptId(plan.getScriptId());
            planDetailDTO.setCreateBy(plan.getCreateBy());
            planDetailDTO.setStatus(plan.getStatus());
            planDetailDTO.setCreatedAt(plan.getCreatedAt());
            planDetailDTO.setUpdatedAt(plan.getUpdatedAt());
            planDetailDTO.setUpdateBy(plan.getUpdateBy());
            planDetailDTO.setPlanDetail(this.reportRepository.findAllByPlanId(plan.getId()));
            planDetailDTOS.add(planDetailDTO);
        }
        return planDetailDTOS;
    }
}
