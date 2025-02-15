package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ReportType;
import com.mycompany.myapp.repository.ReportTypeRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ReportType}.
 */
@RestController
@RequestMapping("/api/report-types")
@Transactional
public class ReportTypeResource {

    private final Logger log = LoggerFactory.getLogger(ReportTypeResource.class);

    private static final String ENTITY_NAME = "reportType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReportTypeRepository reportTypeRepository;

    public ReportTypeResource(ReportTypeRepository reportTypeRepository) {
        this.reportTypeRepository = reportTypeRepository;
    }

    /**
     * {@code POST  /report-types} : Create a new reportType.
     *
     * @param reportType the reportType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reportType, or with status {@code 400 (Bad Request)} if the reportType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ReportType> createReportType(@RequestBody ReportType reportType) throws URISyntaxException {
        log.debug("REST request to save ReportType : {}", reportType);
        if (reportType.getId() != null) {
            throw new BadRequestAlertException("A new reportType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        reportType = reportTypeRepository.save(reportType);
        return ResponseEntity.created(new URI("/api/report-types/" + reportType.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, reportType.getId().toString()))
            .body(reportType);
    }

    /**
     * {@code PUT  /report-types/:id} : Updates an existing reportType.
     *
     * @param id the id of the reportType to save.
     * @param reportType the reportType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reportType,
     * or with status {@code 400 (Bad Request)} if the reportType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reportType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReportType> updateReportType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReportType reportType
    ) throws URISyntaxException {
        log.debug("REST request to update ReportType : {}, {}", id, reportType);
        if (reportType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reportType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reportTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        reportType = reportTypeRepository.save(reportType);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reportType.getId().toString()))
            .body(reportType);
    }

    /**
     * {@code PATCH  /report-types/:id} : Partial updates given fields of an existing reportType, field will ignore if it is null
     *
     * @param id the id of the reportType to save.
     * @param reportType the reportType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reportType,
     * or with status {@code 400 (Bad Request)} if the reportType is not valid,
     * or with status {@code 404 (Not Found)} if the reportType is not found,
     * or with status {@code 500 (Internal Server Error)} if the reportType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ReportType> partialUpdateReportType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReportType reportType
    ) throws URISyntaxException {
        log.debug("REST request to partial update ReportType partially : {}, {}", id, reportType);
        if (reportType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reportType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reportTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReportType> result = reportTypeRepository
            .findById(reportType.getId())
            .map(existingReportType -> {
                if (reportType.getCode() != null) {
                    existingReportType.setCode(reportType.getCode());
                }
                if (reportType.getName() != null) {
                    existingReportType.setName(reportType.getName());
                }
                if (reportType.getStatus() != null) {
                    existingReportType.setStatus(reportType.getStatus());
                }
                if (reportType.getCreatedAt() != null) {
                    existingReportType.setCreatedAt(reportType.getCreatedAt());
                }
                if (reportType.getUpdatedAt() != null) {
                    existingReportType.setUpdatedAt(reportType.getUpdatedAt());
                }
                if (reportType.getUpdateBy() != null) {
                    existingReportType.setUpdateBy(reportType.getUpdateBy());
                }

                return existingReportType;
            })
            .map(reportTypeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reportType.getId().toString())
        );
    }

    /**
     * {@code GET  /report-types} : get all the reportTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reportTypes in body.
     */
    @GetMapping("")
    public List<ReportType> getAllReportTypes() {
        log.debug("REST request to get all ReportTypes");
        return reportTypeRepository.findAll();
    }

    /**
     * {@code GET  /report-types/:id} : get the "id" reportType.
     *
     * @param id the id of the reportType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reportType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReportType> getReportType(@PathVariable("id") Long id) {
        log.debug("REST request to get ReportType : {}", id);
        Optional<ReportType> reportType = reportTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(reportType);
    }

    /**
     * {@code DELETE  /report-types/:id} : delete the "id" reportType.
     *
     * @param id the id of the reportType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReportType(@PathVariable("id") Long id) {
        log.debug("REST request to delete ReportType : {}", id);
        reportTypeRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
