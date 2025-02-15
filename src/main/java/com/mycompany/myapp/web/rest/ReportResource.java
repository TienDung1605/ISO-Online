package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Report;
import com.mycompany.myapp.repository.ReportRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Report}.
 */
@RestController
@RequestMapping("/api/reports")
@Transactional
public class ReportResource {

    private final Logger log = LoggerFactory.getLogger(ReportResource.class);

    private static final String ENTITY_NAME = "report";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReportRepository reportRepository;

    public ReportResource(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    /**
     * {@code POST  /reports} : Create a new report.
     *
     * @param report the report to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new report, or with status {@code 400 (Bad Request)} if the report has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Report> createReport(@RequestBody Report report) throws URISyntaxException {
        log.debug("REST request to save Report : {}", report);
        if (report.getId() != null) {
            throw new BadRequestAlertException("A new report cannot already have an ID", ENTITY_NAME, "idexists");
        }
        report = reportRepository.save(report);
        return ResponseEntity.created(new URI("/api/reports/" + report.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, report.getId().toString()))
            .body(report);
    }

    /**
     * {@code PUT  /reports/:id} : Updates an existing report.
     *
     * @param id the id of the report to save.
     * @param report the report to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated report,
     * or with status {@code 400 (Bad Request)} if the report is not valid,
     * or with status {@code 500 (Internal Server Error)} if the report couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Report> updateReport(@PathVariable(value = "id", required = false) final Long id, @RequestBody Report report)
        throws URISyntaxException {
        log.debug("REST request to update Report : {}, {}", id, report);
        if (report.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, report.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reportRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        report = reportRepository.save(report);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, report.getId().toString()))
            .body(report);
    }

    /**
     * {@code PATCH  /reports/:id} : Partial updates given fields of an existing report, field will ignore if it is null
     *
     * @param id the id of the report to save.
     * @param report the report to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated report,
     * or with status {@code 400 (Bad Request)} if the report is not valid,
     * or with status {@code 404 (Not Found)} if the report is not found,
     * or with status {@code 500 (Internal Server Error)} if the report couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Report> partialUpdateReport(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Report report
    ) throws URISyntaxException {
        log.debug("REST request to partial update Report partially : {}, {}", id, report);
        if (report.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, report.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reportRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Report> result = reportRepository
            .findById(report.getId())
            .map(existingReport -> {
                if (report.getName() != null) {
                    existingReport.setName(report.getName());
                }
                if (report.getCode() != null) {
                    existingReport.setCode(report.getCode());
                }
                if (report.getSampleReportId() != null) {
                    existingReport.setSampleReportId(report.getSampleReportId());
                }
                if (report.getTestOfObject() != null) {
                    existingReport.setTestOfObject(report.getTestOfObject());
                }
                if (report.getChecker() != null) {
                    existingReport.setChecker(report.getChecker());
                }
                if (report.getStatus() != null) {
                    existingReport.setStatus(report.getStatus());
                }
                if (report.getFrequency() != null) {
                    existingReport.setFrequency(report.getFrequency());
                }
                if (report.getReportType() != null) {
                    existingReport.setReportType(report.getReportType());
                }
                if (report.getReportTypeId() != null) {
                    existingReport.setReportTypeId(report.getReportTypeId());
                }
                if (report.getCreatedAt() != null) {
                    existingReport.setCreatedAt(report.getCreatedAt());
                }
                if (report.getUpdatedAt() != null) {
                    existingReport.setUpdatedAt(report.getUpdatedAt());
                }
                if (report.getScoreScale() != null) {
                    existingReport.setScoreScale(report.getScoreScale());
                }
                if (report.getUpdateBy() != null) {
                    existingReport.setUpdateBy(report.getUpdateBy());
                }
                if (report.getPlanId() != null) {
                    existingReport.setPlanId(report.getPlanId());
                }
                if (report.getUser() != null) {
                    existingReport.setUser(report.getUser());
                }

                return existingReport;
            })
            .map(reportRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, report.getId().toString())
        );
    }

    /**
     * {@code GET  /reports} : get all the reports.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reports in body.
     */
    @GetMapping("")
    public List<Report> getAllReports() {
        log.debug("REST request to get all Reports");
        return reportRepository.findAll();
    }

    /**
     * {@code GET  /reports/:id} : get the "id" report.
     *
     * @param id the id of the report to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the report, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Report> getReport(@PathVariable("id") Long id) {
        log.debug("REST request to get Report : {}", id);
        Optional<Report> report = reportRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(report);
    }

    /**
     * {@code DELETE  /reports/:id} : delete the "id" report.
     *
     * @param id the id of the report to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable("id") Long id) {
        log.debug("REST request to delete Report : {}", id);
        reportRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
