package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.SampleReport;
import com.mycompany.myapp.repository.SampleReportRepository;
import com.mycompany.myapp.service.dto.SampleReportRequestDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.SampleReport}.
 */
@RestController
@RequestMapping("/api/sample-reports")
@Transactional
public class SampleReportResource {

    @PersistenceContext
    private EntityManager entityManager;

    private final Logger log = LoggerFactory.getLogger(SampleReportResource.class);

    private static final String ENTITY_NAME = "sampleReport";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SampleReportRepository sampleReportRepository;

    public SampleReportResource(SampleReportRepository sampleReportRepository) {
        this.sampleReportRepository = sampleReportRepository;
    }

    /**
     * {@code POST  /sample-reports} : Create a new sampleReport.
     *
     * @param sampleReport the sampleReport to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sampleReport, or with status {@code 400 (Bad Request)} if the sampleReport has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<SampleReport> createSampleReport(@RequestBody SampleReport sampleReport) throws URISyntaxException {
        log.debug("REST request to save SampleReport : {}", sampleReport);
        if (sampleReport.getId() != null) {
            throw new BadRequestAlertException("A new sampleReport cannot already have an ID", ENTITY_NAME, "idexists");
        }
        sampleReport = sampleReportRepository.save(sampleReport);
        return ResponseEntity.created(new URI("/api/sample-reports/" + sampleReport.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, sampleReport.getId().toString()))
            .body(sampleReport);
    }

    /**
     * {@code PUT  /sample-reports/:id} : Updates an existing sampleReport.
     *
     * @param id the id of the sampleReport to save.
     * @param sampleReport the sampleReport to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sampleReport,
     * or with status {@code 400 (Bad Request)} if the sampleReport is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sampleReport couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SampleReport> updateSampleReport(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SampleReport sampleReport
    ) throws URISyntaxException {
        log.debug("REST request to update SampleReport : {}, {}", id, sampleReport);
        if (sampleReport.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sampleReport.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sampleReportRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        sampleReport = sampleReportRepository.save(sampleReport);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sampleReport.getId().toString()))
            .body(sampleReport);
    }

    /**
     * {@code PATCH  /sample-reports/:id} : Partial updates given fields of an existing sampleReport, field will ignore if it is null
     *
     * @param id the id of the sampleReport to save.
     * @param sampleReport the sampleReport to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sampleReport,
     * or with status {@code 400 (Bad Request)} if the sampleReport is not valid,
     * or with status {@code 404 (Not Found)} if the sampleReport is not found,
     * or with status {@code 500 (Internal Server Error)} if the sampleReport couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SampleReport> partialUpdateSampleReport(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SampleReport sampleReport
    ) throws URISyntaxException {
        log.debug("REST request to partial update SampleReport partially : {}, {}", id, sampleReport);
        if (sampleReport.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sampleReport.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sampleReportRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SampleReport> result = sampleReportRepository
            .findById(sampleReport.getId())
            .map(existingSampleReport -> {
                if (sampleReport.getName() != null) {
                    existingSampleReport.setName(sampleReport.getName());
                }
                if (sampleReport.getStatus() != null) {
                    existingSampleReport.setStatus(sampleReport.getStatus());
                }
                if (sampleReport.getCreatedAt() != null) {
                    existingSampleReport.setCreatedAt(sampleReport.getCreatedAt());
                }
                if (sampleReport.getUpdatedAt() != null) {
                    existingSampleReport.setUpdatedAt(sampleReport.getUpdatedAt());
                }
                if (sampleReport.getUpdateBy() != null) {
                    existingSampleReport.setUpdateBy(sampleReport.getUpdateBy());
                }
                if (sampleReport.getFrequency() != null) {
                    existingSampleReport.setFrequency(sampleReport.getFrequency());
                }
                if (sampleReport.getCode() != null) {
                    existingSampleReport.setCode(sampleReport.getCode());
                }
                if (sampleReport.getReportType() != null) {
                    existingSampleReport.setReportType(sampleReport.getReportType());
                }
                if (sampleReport.getReportTypeId() != null) {
                    existingSampleReport.setReportTypeId(sampleReport.getReportTypeId());
                }

                return existingSampleReport;
            })
            .map(sampleReportRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sampleReport.getId().toString())
        );
    }

    /**
     * {@code GET  /sample-reports} : get all the sampleReports.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sampleReports in body.
     */
    @GetMapping("")
    public List<SampleReport> getAllSampleReports() {
        log.debug("REST request to get all SampleReports");
        return sampleReportRepository.findAll();
    }

    /**
     * {@code GET  /sample-reports/:id} : get the "id" sampleReport.
     *
     * @param id the id of the sampleReport to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sampleReport, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SampleReport> getSampleReport(@PathVariable("id") Long id) {
        log.debug("REST request to get SampleReport : {}", id);
        Optional<SampleReport> sampleReport = sampleReportRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sampleReport);
    }

    /**
     * {@code DELETE  /sample-reports/:id} : delete the "id" sampleReport.
     *
     * @param id the id of the sampleReport to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSampleReport(@PathVariable("id") Long id) {
        log.debug("REST request to delete SampleReport : {}", id);
        sampleReportRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @PostMapping("/list")
    public List<Object> getList(@RequestBody SampleReportRequestDTO requestDTO) {
        String sql = "SELECT " + requestDTO.getField_name() + " FROM iso." + requestDTO.getSource_table() + " ;";
        Query query = this.entityManager.createNativeQuery(sql);
        return query.getResultList();
    }

    @GetMapping("/all")
    public List<Object> getSampleReports() {
        List<Object> list = this.sampleReportRepository.getSampleReports();
        return list;
    }

    @GetMapping("/detail/{code}")
    public String getSampleReportDetail(@PathVariable String code) {
        String result = this.sampleReportRepository.getSampleReportDetail(code);
        return result;
    }
}
