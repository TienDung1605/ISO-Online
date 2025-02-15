package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.InspectionReportTitles;
import com.mycompany.myapp.repository.InspectionReportTitlesRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.InspectionReportTitles}.
 */
@RestController
@RequestMapping("/api/inspection-report-titles")
@Transactional
public class InspectionReportTitlesResource {

    private final Logger log = LoggerFactory.getLogger(InspectionReportTitlesResource.class);

    private static final String ENTITY_NAME = "inspectionReportTitles";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InspectionReportTitlesRepository inspectionReportTitlesRepository;

    public InspectionReportTitlesResource(InspectionReportTitlesRepository inspectionReportTitlesRepository) {
        this.inspectionReportTitlesRepository = inspectionReportTitlesRepository;
    }

    /**
     * {@code POST  /inspection-report-titles} : Create a new inspectionReportTitles.
     *
     * @param inspectionReportTitles the inspectionReportTitles to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new inspectionReportTitles, or with status {@code 400 (Bad Request)} if the inspectionReportTitles has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<InspectionReportTitles> createInspectionReportTitles(@RequestBody InspectionReportTitles inspectionReportTitles)
        throws URISyntaxException {
        log.debug("REST request to save InspectionReportTitles : {}", inspectionReportTitles);
        if (inspectionReportTitles.getId() != null) {
            throw new BadRequestAlertException("A new inspectionReportTitles cannot already have an ID", ENTITY_NAME, "idexists");
        }
        inspectionReportTitles = inspectionReportTitlesRepository.save(inspectionReportTitles);
        return ResponseEntity.created(new URI("/api/inspection-report-titles/" + inspectionReportTitles.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, inspectionReportTitles.getId().toString()))
            .body(inspectionReportTitles);
    }

    /**
     * {@code PUT  /inspection-report-titles/:id} : Updates an existing inspectionReportTitles.
     *
     * @param id the id of the inspectionReportTitles to save.
     * @param inspectionReportTitles the inspectionReportTitles to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inspectionReportTitles,
     * or with status {@code 400 (Bad Request)} if the inspectionReportTitles is not valid,
     * or with status {@code 500 (Internal Server Error)} if the inspectionReportTitles couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<InspectionReportTitles> updateInspectionReportTitles(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InspectionReportTitles inspectionReportTitles
    ) throws URISyntaxException {
        log.debug("REST request to update InspectionReportTitles : {}, {}", id, inspectionReportTitles);
        if (inspectionReportTitles.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, inspectionReportTitles.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inspectionReportTitlesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        inspectionReportTitles = inspectionReportTitlesRepository.save(inspectionReportTitles);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inspectionReportTitles.getId().toString()))
            .body(inspectionReportTitles);
    }

    /**
     * {@code PATCH  /inspection-report-titles/:id} : Partial updates given fields of an existing inspectionReportTitles, field will ignore if it is null
     *
     * @param id the id of the inspectionReportTitles to save.
     * @param inspectionReportTitles the inspectionReportTitles to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inspectionReportTitles,
     * or with status {@code 400 (Bad Request)} if the inspectionReportTitles is not valid,
     * or with status {@code 404 (Not Found)} if the inspectionReportTitles is not found,
     * or with status {@code 500 (Internal Server Error)} if the inspectionReportTitles couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<InspectionReportTitles> partialUpdateInspectionReportTitles(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InspectionReportTitles inspectionReportTitles
    ) throws URISyntaxException {
        log.debug("REST request to partial update InspectionReportTitles partially : {}, {}", id, inspectionReportTitles);
        if (inspectionReportTitles.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, inspectionReportTitles.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inspectionReportTitlesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<InspectionReportTitles> result = inspectionReportTitlesRepository
            .findById(inspectionReportTitles.getId())
            .map(existingInspectionReportTitles -> {
                if (inspectionReportTitles.getNameTitle() != null) {
                    existingInspectionReportTitles.setNameTitle(inspectionReportTitles.getNameTitle());
                }
                if (inspectionReportTitles.getSource() != null) {
                    existingInspectionReportTitles.setSource(inspectionReportTitles.getSource());
                }
                if (inspectionReportTitles.getField() != null) {
                    existingInspectionReportTitles.setField(inspectionReportTitles.getField());
                }
                if (inspectionReportTitles.getDataType() != null) {
                    existingInspectionReportTitles.setDataType(inspectionReportTitles.getDataType());
                }
                if (inspectionReportTitles.getTimeCreate() != null) {
                    existingInspectionReportTitles.setTimeCreate(inspectionReportTitles.getTimeCreate());
                }
                if (inspectionReportTitles.getTimeUpdate() != null) {
                    existingInspectionReportTitles.setTimeUpdate(inspectionReportTitles.getTimeUpdate());
                }
                if (inspectionReportTitles.getSampleReportId() != null) {
                    existingInspectionReportTitles.setSampleReportId(inspectionReportTitles.getSampleReportId());
                }

                return existingInspectionReportTitles;
            })
            .map(inspectionReportTitlesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inspectionReportTitles.getId().toString())
        );
    }

    /**
     * {@code GET  /inspection-report-titles} : get all the inspectionReportTitles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of inspectionReportTitles in body.
     */
    @GetMapping("")
    public List<InspectionReportTitles> getAllInspectionReportTitles() {
        log.debug("REST request to get all InspectionReportTitles");
        return inspectionReportTitlesRepository.findAll();
    }

    /**
     * {@code GET  /inspection-report-titles/:id} : get the "id" inspectionReportTitles.
     *
     * @param id the id of the inspectionReportTitles to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the inspectionReportTitles, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<InspectionReportTitles> getInspectionReportTitles(@PathVariable("id") Long id) {
        log.debug("REST request to get InspectionReportTitles : {}", id);
        Optional<InspectionReportTitles> inspectionReportTitles = inspectionReportTitlesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(inspectionReportTitles);
    }

    /**
     * {@code DELETE  /inspection-report-titles/:id} : delete the "id" inspectionReportTitles.
     *
     * @param id the id of the inspectionReportTitles to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInspectionReportTitles(@PathVariable("id") Long id) {
        log.debug("REST request to delete InspectionReportTitles : {}", id);
        inspectionReportTitlesRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
