package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.SampleReportCriteria;
import com.mycompany.myapp.repository.SampleReportCriteriaRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.SampleReportCriteria}.
 */
@RestController
@RequestMapping("/api/sample-report-criteria")
@Transactional
public class SampleReportCriteriaResource {

    private final Logger log = LoggerFactory.getLogger(SampleReportCriteriaResource.class);

    private static final String ENTITY_NAME = "sampleReportCriteria";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SampleReportCriteriaRepository sampleReportCriteriaRepository;

    public SampleReportCriteriaResource(SampleReportCriteriaRepository sampleReportCriteriaRepository) {
        this.sampleReportCriteriaRepository = sampleReportCriteriaRepository;
    }

    /**
     * {@code POST  /sample-report-criteria} : Create a new sampleReportCriteria.
     *
     * @param sampleReportCriteria the sampleReportCriteria to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sampleReportCriteria, or with status {@code 400 (Bad Request)} if the sampleReportCriteria has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<SampleReportCriteria> createSampleReportCriteria(@RequestBody SampleReportCriteria sampleReportCriteria)
        throws URISyntaxException {
        log.debug("REST request to save SampleReportCriteria : {}", sampleReportCriteria);
        if (sampleReportCriteria.getId() != null) {
            throw new BadRequestAlertException("A new sampleReportCriteria cannot already have an ID", ENTITY_NAME, "idexists");
        }
        sampleReportCriteria = sampleReportCriteriaRepository.save(sampleReportCriteria);
        return ResponseEntity.created(new URI("/api/sample-report-criteria/" + sampleReportCriteria.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, sampleReportCriteria.getId().toString()))
            .body(sampleReportCriteria);
    }

    /**
     * {@code PUT  /sample-report-criteria/:id} : Updates an existing sampleReportCriteria.
     *
     * @param id the id of the sampleReportCriteria to save.
     * @param sampleReportCriteria the sampleReportCriteria to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sampleReportCriteria,
     * or with status {@code 400 (Bad Request)} if the sampleReportCriteria is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sampleReportCriteria couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SampleReportCriteria> updateSampleReportCriteria(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SampleReportCriteria sampleReportCriteria
    ) throws URISyntaxException {
        log.debug("REST request to update SampleReportCriteria : {}, {}", id, sampleReportCriteria);
        if (sampleReportCriteria.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sampleReportCriteria.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sampleReportCriteriaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        sampleReportCriteria = sampleReportCriteriaRepository.save(sampleReportCriteria);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sampleReportCriteria.getId().toString()))
            .body(sampleReportCriteria);
    }

    /**
     * {@code PATCH  /sample-report-criteria/:id} : Partial updates given fields of an existing sampleReportCriteria, field will ignore if it is null
     *
     * @param id the id of the sampleReportCriteria to save.
     * @param sampleReportCriteria the sampleReportCriteria to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sampleReportCriteria,
     * or with status {@code 400 (Bad Request)} if the sampleReportCriteria is not valid,
     * or with status {@code 404 (Not Found)} if the sampleReportCriteria is not found,
     * or with status {@code 500 (Internal Server Error)} if the sampleReportCriteria couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SampleReportCriteria> partialUpdateSampleReportCriteria(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SampleReportCriteria sampleReportCriteria
    ) throws URISyntaxException {
        log.debug("REST request to partial update SampleReportCriteria partially : {}, {}", id, sampleReportCriteria);
        if (sampleReportCriteria.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sampleReportCriteria.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sampleReportCriteriaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SampleReportCriteria> result = sampleReportCriteriaRepository
            .findById(sampleReportCriteria.getId())
            .map(existingSampleReportCriteria -> {
                if (sampleReportCriteria.getCriteriaName() != null) {
                    existingSampleReportCriteria.setCriteriaName(sampleReportCriteria.getCriteriaName());
                }
                if (sampleReportCriteria.getCriteriaGroupName() != null) {
                    existingSampleReportCriteria.setCriteriaGroupName(sampleReportCriteria.getCriteriaGroupName());
                }
                if (sampleReportCriteria.getCriteriaId() != null) {
                    existingSampleReportCriteria.setCriteriaId(sampleReportCriteria.getCriteriaId());
                }
                if (sampleReportCriteria.getCriteriaGroupId() != null) {
                    existingSampleReportCriteria.setCriteriaGroupId(sampleReportCriteria.getCriteriaGroupId());
                }
                if (sampleReportCriteria.getStatus() != null) {
                    existingSampleReportCriteria.setStatus(sampleReportCriteria.getStatus());
                }
                if (sampleReportCriteria.getCreatedAt() != null) {
                    existingSampleReportCriteria.setCreatedAt(sampleReportCriteria.getCreatedAt());
                }
                if (sampleReportCriteria.getUpdatedAt() != null) {
                    existingSampleReportCriteria.setUpdatedAt(sampleReportCriteria.getUpdatedAt());
                }
                if (sampleReportCriteria.getUpdateBy() != null) {
                    existingSampleReportCriteria.setUpdateBy(sampleReportCriteria.getUpdateBy());
                }
                if (sampleReportCriteria.getFrequency() != null) {
                    existingSampleReportCriteria.setFrequency(sampleReportCriteria.getFrequency());
                }
                if (sampleReportCriteria.getSampleReportId() != null) {
                    existingSampleReportCriteria.setSampleReportId(sampleReportCriteria.getSampleReportId());
                }
                if (sampleReportCriteria.getDetail() != null) {
                    existingSampleReportCriteria.setDetail(sampleReportCriteria.getDetail());
                }

                return existingSampleReportCriteria;
            })
            .map(sampleReportCriteriaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sampleReportCriteria.getId().toString())
        );
    }

    /**
     * {@code GET  /sample-report-criteria} : get all the sampleReportCriteria.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sampleReportCriteria in body.
     */
    @GetMapping("")
    public List<SampleReportCriteria> getAllSampleReportCriteria() {
        log.debug("REST request to get all SampleReportCriteria");
        return sampleReportCriteriaRepository.findAll();
    }

    /**
     * {@code GET  /sample-report-criteria/:id} : get the "id" sampleReportCriteria.
     *
     * @param id the id of the sampleReportCriteria to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sampleReportCriteria, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SampleReportCriteria> getSampleReportCriteria(@PathVariable("id") Long id) {
        log.debug("REST request to get SampleReportCriteria : {}", id);
        Optional<SampleReportCriteria> sampleReportCriteria = sampleReportCriteriaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sampleReportCriteria);
    }

    /**
     * {@code DELETE  /sample-report-criteria/:id} : delete the "id" sampleReportCriteria.
     *
     * @param id the id of the sampleReportCriteria to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSampleReportCriteria(@PathVariable("id") Long id) {
        log.debug("REST request to delete SampleReportCriteria : {}", id);
        sampleReportCriteriaRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
