package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ReportTitle;
import com.mycompany.myapp.repository.ReportTitleRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ReportTitle}.
 */
@RestController
@RequestMapping("/api/report-titles")
@Transactional
public class ReportTitleResource {

    private final Logger log = LoggerFactory.getLogger(ReportTitleResource.class);

    private static final String ENTITY_NAME = "reportTitle";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReportTitleRepository reportTitleRepository;

    public ReportTitleResource(ReportTitleRepository reportTitleRepository) {
        this.reportTitleRepository = reportTitleRepository;
    }

    /**
     * {@code POST  /report-titles} : Create a new reportTitle.
     *
     * @param reportTitle the reportTitle to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reportTitle, or with status {@code 400 (Bad Request)} if the reportTitle has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ReportTitle> createReportTitle(@RequestBody ReportTitle reportTitle) throws URISyntaxException {
        log.debug("REST request to save ReportTitle : {}", reportTitle);
        if (reportTitle.getId() != null) {
            throw new BadRequestAlertException("A new reportTitle cannot already have an ID", ENTITY_NAME, "idexists");
        }
        reportTitle = reportTitleRepository.save(reportTitle);
        return ResponseEntity.created(new URI("/api/report-titles/" + reportTitle.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, reportTitle.getId().toString()))
            .body(reportTitle);
    }

    /**
     * {@code PUT  /report-titles/:id} : Updates an existing reportTitle.
     *
     * @param id the id of the reportTitle to save.
     * @param reportTitle the reportTitle to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reportTitle,
     * or with status {@code 400 (Bad Request)} if the reportTitle is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reportTitle couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReportTitle> updateReportTitle(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReportTitle reportTitle
    ) throws URISyntaxException {
        log.debug("REST request to update ReportTitle : {}, {}", id, reportTitle);
        if (reportTitle.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reportTitle.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reportTitleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        reportTitle = reportTitleRepository.save(reportTitle);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reportTitle.getId().toString()))
            .body(reportTitle);
    }

    /**
     * {@code PATCH  /report-titles/:id} : Partial updates given fields of an existing reportTitle, field will ignore if it is null
     *
     * @param id the id of the reportTitle to save.
     * @param reportTitle the reportTitle to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reportTitle,
     * or with status {@code 400 (Bad Request)} if the reportTitle is not valid,
     * or with status {@code 404 (Not Found)} if the reportTitle is not found,
     * or with status {@code 500 (Internal Server Error)} if the reportTitle couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ReportTitle> partialUpdateReportTitle(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReportTitle reportTitle
    ) throws URISyntaxException {
        log.debug("REST request to partial update ReportTitle partially : {}, {}", id, reportTitle);
        if (reportTitle.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reportTitle.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reportTitleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReportTitle> result = reportTitleRepository
            .findById(reportTitle.getId())
            .map(existingReportTitle -> {
                if (reportTitle.getName() != null) {
                    existingReportTitle.setName(reportTitle.getName());
                }
                if (reportTitle.getSource() != null) {
                    existingReportTitle.setSource(reportTitle.getSource());
                }
                if (reportTitle.getField() != null) {
                    existingReportTitle.setField(reportTitle.getField());
                }
                if (reportTitle.getDataType() != null) {
                    existingReportTitle.setDataType(reportTitle.getDataType());
                }
                if (reportTitle.getIndex() != null) {
                    existingReportTitle.setIndex(reportTitle.getIndex());
                }
                if (reportTitle.getCreatedAt() != null) {
                    existingReportTitle.setCreatedAt(reportTitle.getCreatedAt());
                }
                if (reportTitle.getUpdatedAt() != null) {
                    existingReportTitle.setUpdatedAt(reportTitle.getUpdatedAt());
                }
                if (reportTitle.getUpdateBy() != null) {
                    existingReportTitle.setUpdateBy(reportTitle.getUpdateBy());
                }
                if (reportTitle.getReportId() != null) {
                    existingReportTitle.setReportId(reportTitle.getReportId());
                }

                return existingReportTitle;
            })
            .map(reportTitleRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reportTitle.getId().toString())
        );
    }

    /**
     * {@code GET  /report-titles} : get all the reportTitles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reportTitles in body.
     */
    @GetMapping("")
    public List<ReportTitle> getAllReportTitles() {
        log.debug("REST request to get all ReportTitles");
        return reportTitleRepository.findAll();
    }

    /**
     * {@code GET  /report-titles/:id} : get the "id" reportTitle.
     *
     * @param id the id of the reportTitle to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reportTitle, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReportTitle> getReportTitle(@PathVariable("id") Long id) {
        log.debug("REST request to get ReportTitle : {}", id);
        Optional<ReportTitle> reportTitle = reportTitleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(reportTitle);
    }

    /**
     * {@code DELETE  /report-titles/:id} : delete the "id" reportTitle.
     *
     * @param id the id of the reportTitle to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReportTitle(@PathVariable("id") Long id) {
        log.debug("REST request to delete ReportTitle : {}", id);
        reportTitleRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
