package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ReportCriteria;
import com.mycompany.myapp.repository.ReportCriteriaRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ReportCriteria}.
 */
@RestController
@RequestMapping("/api/report-criteria")
@Transactional
public class ReportCriteriaResource {

    private final Logger log = LoggerFactory.getLogger(ReportCriteriaResource.class);

    private static final String ENTITY_NAME = "reportCriteria";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReportCriteriaRepository reportCriteriaRepository;

    public ReportCriteriaResource(ReportCriteriaRepository reportCriteriaRepository) {
        this.reportCriteriaRepository = reportCriteriaRepository;
    }

    /**
     * {@code POST  /report-criteria} : Create a new reportCriteria.
     *
     * @param reportCriteria the reportCriteria to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reportCriteria, or with status {@code 400 (Bad Request)} if the reportCriteria has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ReportCriteria> createReportCriteria(@RequestBody ReportCriteria reportCriteria) throws URISyntaxException {
        log.debug("REST request to save ReportCriteria : {}", reportCriteria);
        if (reportCriteria.getId() != null) {
            throw new BadRequestAlertException("A new reportCriteria cannot already have an ID", ENTITY_NAME, "idexists");
        }
        reportCriteria = reportCriteriaRepository.save(reportCriteria);
        return ResponseEntity.created(new URI("/api/report-criteria/" + reportCriteria.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, reportCriteria.getId().toString()))
            .body(reportCriteria);
    }

    /**
     * {@code PUT  /report-criteria/:id} : Updates an existing reportCriteria.
     *
     * @param id the id of the reportCriteria to save.
     * @param reportCriteria the reportCriteria to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reportCriteria,
     * or with status {@code 400 (Bad Request)} if the reportCriteria is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reportCriteria couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReportCriteria> updateReportCriteria(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReportCriteria reportCriteria
    ) throws URISyntaxException {
        log.debug("REST request to update ReportCriteria : {}, {}", id, reportCriteria);
        if (reportCriteria.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reportCriteria.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reportCriteriaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        reportCriteria = reportCriteriaRepository.save(reportCriteria);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reportCriteria.getId().toString()))
            .body(reportCriteria);
    }

    /**
     * {@code PATCH  /report-criteria/:id} : Partial updates given fields of an existing reportCriteria, field will ignore if it is null
     *
     * @param id the id of the reportCriteria to save.
     * @param reportCriteria the reportCriteria to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reportCriteria,
     * or with status {@code 400 (Bad Request)} if the reportCriteria is not valid,
     * or with status {@code 404 (Not Found)} if the reportCriteria is not found,
     * or with status {@code 500 (Internal Server Error)} if the reportCriteria couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ReportCriteria> partialUpdateReportCriteria(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReportCriteria reportCriteria
    ) throws URISyntaxException {
        log.debug("REST request to partial update ReportCriteria partially : {}, {}", id, reportCriteria);
        if (reportCriteria.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reportCriteria.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reportCriteriaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReportCriteria> result = reportCriteriaRepository
            .findById(reportCriteria.getId())
            .map(existingReportCriteria -> {
                if (reportCriteria.getCriteriaName() != null) {
                    existingReportCriteria.setCriteriaName(reportCriteria.getCriteriaName());
                }
                if (reportCriteria.getCriteriaGroupName() != null) {
                    existingReportCriteria.setCriteriaGroupName(reportCriteria.getCriteriaGroupName());
                }
                if (reportCriteria.getCriteriaId() != null) {
                    existingReportCriteria.setCriteriaId(reportCriteria.getCriteriaId());
                }
                if (reportCriteria.getCriteriaGroupId() != null) {
                    existingReportCriteria.setCriteriaGroupId(reportCriteria.getCriteriaGroupId());
                }
                if (reportCriteria.getStatus() != null) {
                    existingReportCriteria.setStatus(reportCriteria.getStatus());
                }
                if (reportCriteria.getCreatedAt() != null) {
                    existingReportCriteria.setCreatedAt(reportCriteria.getCreatedAt());
                }
                if (reportCriteria.getUpdatedAt() != null) {
                    existingReportCriteria.setUpdatedAt(reportCriteria.getUpdatedAt());
                }
                if (reportCriteria.getUpdateBy() != null) {
                    existingReportCriteria.setUpdateBy(reportCriteria.getUpdateBy());
                }
                if (reportCriteria.getFrequency() != null) {
                    existingReportCriteria.setFrequency(reportCriteria.getFrequency());
                }
                if (reportCriteria.getReportId() != null) {
                    existingReportCriteria.setReportId(reportCriteria.getReportId());
                }

                return existingReportCriteria;
            })
            .map(reportCriteriaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reportCriteria.getId().toString())
        );
    }

    /**
     * {@code GET  /report-criteria} : get all the reportCriteria.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reportCriteria in body.
     */
    @GetMapping("")
    public List<ReportCriteria> getAllReportCriteria() {
        log.debug("REST request to get all ReportCriteria");
        return reportCriteriaRepository.findAll();
    }

    /**
     * {@code GET  /report-criteria/:id} : get the "id" reportCriteria.
     *
     * @param id the id of the reportCriteria to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reportCriteria, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReportCriteria> getReportCriteria(@PathVariable("id") Long id) {
        log.debug("REST request to get ReportCriteria : {}", id);
        Optional<ReportCriteria> reportCriteria = reportCriteriaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(reportCriteria);
    }

    /**
     * {@code DELETE  /report-criteria/:id} : delete the "id" reportCriteria.
     *
     * @param id the id of the reportCriteria to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReportCriteria(@PathVariable("id") Long id) {
        log.debug("REST request to delete ReportCriteria : {}", id);
        reportCriteriaRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
