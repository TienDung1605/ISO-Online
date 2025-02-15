package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CheckTarget;
import com.mycompany.myapp.repository.CheckTargetRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.CheckTarget}.
 */
@RestController
@RequestMapping("/api/check-targets")
@Transactional
public class CheckTargetResource {

    private final Logger log = LoggerFactory.getLogger(CheckTargetResource.class);

    private static final String ENTITY_NAME = "checkTarget";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CheckTargetRepository checkTargetRepository;

    public CheckTargetResource(CheckTargetRepository checkTargetRepository) {
        this.checkTargetRepository = checkTargetRepository;
    }

    /**
     * {@code POST  /check-targets} : Create a new checkTarget.
     *
     * @param checkTarget the checkTarget to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new checkTarget, or with status {@code 400 (Bad Request)} if the checkTarget has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CheckTarget> createCheckTarget(@RequestBody CheckTarget checkTarget) throws URISyntaxException {
        log.debug("REST request to save CheckTarget : {}", checkTarget);
        if (checkTarget.getId() != null) {
            throw new BadRequestAlertException("A new checkTarget cannot already have an ID", ENTITY_NAME, "idexists");
        }
        checkTarget = checkTargetRepository.save(checkTarget);
        return ResponseEntity.created(new URI("/api/check-targets/" + checkTarget.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, checkTarget.getId().toString()))
            .body(checkTarget);
    }

    /**
     * {@code PUT  /check-targets/:id} : Updates an existing checkTarget.
     *
     * @param id the id of the checkTarget to save.
     * @param checkTarget the checkTarget to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated checkTarget,
     * or with status {@code 400 (Bad Request)} if the checkTarget is not valid,
     * or with status {@code 500 (Internal Server Error)} if the checkTarget couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CheckTarget> updateCheckTarget(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CheckTarget checkTarget
    ) throws URISyntaxException {
        log.debug("REST request to update CheckTarget : {}, {}", id, checkTarget);
        if (checkTarget.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, checkTarget.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!checkTargetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        checkTarget = checkTargetRepository.save(checkTarget);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, checkTarget.getId().toString()))
            .body(checkTarget);
    }

    /**
     * {@code PATCH  /check-targets/:id} : Partial updates given fields of an existing checkTarget, field will ignore if it is null
     *
     * @param id the id of the checkTarget to save.
     * @param checkTarget the checkTarget to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated checkTarget,
     * or with status {@code 400 (Bad Request)} if the checkTarget is not valid,
     * or with status {@code 404 (Not Found)} if the checkTarget is not found,
     * or with status {@code 500 (Internal Server Error)} if the checkTarget couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CheckTarget> partialUpdateCheckTarget(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CheckTarget checkTarget
    ) throws URISyntaxException {
        log.debug("REST request to partial update CheckTarget partially : {}, {}", id, checkTarget);
        if (checkTarget.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, checkTarget.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!checkTargetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CheckTarget> result = checkTargetRepository
            .findById(checkTarget.getId())
            .map(existingCheckTarget -> {
                if (checkTarget.getName() != null) {
                    existingCheckTarget.setName(checkTarget.getName());
                }
                if (checkTarget.getInspectionTarget() != null) {
                    existingCheckTarget.setInspectionTarget(checkTarget.getInspectionTarget());
                }
                if (checkTarget.getEvaluationLevelId() != null) {
                    existingCheckTarget.setEvaluationLevelId(checkTarget.getEvaluationLevelId());
                }
                if (checkTarget.getStatus() != null) {
                    existingCheckTarget.setStatus(checkTarget.getStatus());
                }
                if (checkTarget.getCreatedAt() != null) {
                    existingCheckTarget.setCreatedAt(checkTarget.getCreatedAt());
                }
                if (checkTarget.getUpdatedAt() != null) {
                    existingCheckTarget.setUpdatedAt(checkTarget.getUpdatedAt());
                }
                if (checkTarget.getUpdateBy() != null) {
                    existingCheckTarget.setUpdateBy(checkTarget.getUpdateBy());
                }

                return existingCheckTarget;
            })
            .map(checkTargetRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, checkTarget.getId().toString())
        );
    }

    /**
     * {@code GET  /check-targets} : get all the checkTargets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of checkTargets in body.
     */
    @GetMapping("")
    public List<CheckTarget> getAllCheckTargets() {
        log.debug("REST request to get all CheckTargets");
        return checkTargetRepository.findAll();
    }

    /**
     * {@code GET  /check-targets/:id} : get the "id" checkTarget.
     *
     * @param id the id of the checkTarget to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the checkTarget, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CheckTarget> getCheckTarget(@PathVariable("id") Long id) {
        log.debug("REST request to get CheckTarget : {}", id);
        Optional<CheckTarget> checkTarget = checkTargetRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(checkTarget);
    }

    /**
     * {@code DELETE  /check-targets/:id} : delete the "id" checkTarget.
     *
     * @param id the id of the checkTarget to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCheckTarget(@PathVariable("id") Long id) {
        log.debug("REST request to delete CheckTarget : {}", id);
        checkTargetRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
