package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CheckLevel;
import com.mycompany.myapp.repository.CheckLevelRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.CheckLevel}.
 */
@RestController
@RequestMapping("/api/check-levels")
@Transactional
public class CheckLevelResource {

    private final Logger log = LoggerFactory.getLogger(CheckLevelResource.class);

    private static final String ENTITY_NAME = "checkLevel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CheckLevelRepository checkLevelRepository;

    public CheckLevelResource(CheckLevelRepository checkLevelRepository) {
        this.checkLevelRepository = checkLevelRepository;
    }

    /**
     * {@code POST  /check-levels} : Create a new checkLevel.
     *
     * @param checkLevel the checkLevel to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new checkLevel, or with status {@code 400 (Bad Request)} if the checkLevel has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CheckLevel> createCheckLevel(@RequestBody CheckLevel checkLevel) throws URISyntaxException {
        log.debug("REST request to save CheckLevel : {}", checkLevel);
        if (checkLevel.getId() != null) {
            throw new BadRequestAlertException("A new checkLevel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        checkLevel = checkLevelRepository.save(checkLevel);
        return ResponseEntity.created(new URI("/api/check-levels/" + checkLevel.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, checkLevel.getId().toString()))
            .body(checkLevel);
    }

    /**
     * {@code PUT  /check-levels/:id} : Updates an existing checkLevel.
     *
     * @param id the id of the checkLevel to save.
     * @param checkLevel the checkLevel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated checkLevel,
     * or with status {@code 400 (Bad Request)} if the checkLevel is not valid,
     * or with status {@code 500 (Internal Server Error)} if the checkLevel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CheckLevel> updateCheckLevel(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CheckLevel checkLevel
    ) throws URISyntaxException {
        log.debug("REST request to update CheckLevel : {}, {}", id, checkLevel);
        if (checkLevel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, checkLevel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!checkLevelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        checkLevel = checkLevelRepository.save(checkLevel);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, checkLevel.getId().toString()))
            .body(checkLevel);
    }

    /**
     * {@code PATCH  /check-levels/:id} : Partial updates given fields of an existing checkLevel, field will ignore if it is null
     *
     * @param id the id of the checkLevel to save.
     * @param checkLevel the checkLevel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated checkLevel,
     * or with status {@code 400 (Bad Request)} if the checkLevel is not valid,
     * or with status {@code 404 (Not Found)} if the checkLevel is not found,
     * or with status {@code 500 (Internal Server Error)} if the checkLevel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CheckLevel> partialUpdateCheckLevel(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CheckLevel checkLevel
    ) throws URISyntaxException {
        log.debug("REST request to partial update CheckLevel partially : {}, {}", id, checkLevel);
        if (checkLevel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, checkLevel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!checkLevelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CheckLevel> result = checkLevelRepository
            .findById(checkLevel.getId())
            .map(existingCheckLevel -> {
                if (checkLevel.getName() != null) {
                    existingCheckLevel.setName(checkLevel.getName());
                }
                if (checkLevel.getStatus() != null) {
                    existingCheckLevel.setStatus(checkLevel.getStatus());
                }
                if (checkLevel.getCreatedAt() != null) {
                    existingCheckLevel.setCreatedAt(checkLevel.getCreatedAt());
                }
                if (checkLevel.getUpdatedAt() != null) {
                    existingCheckLevel.setUpdatedAt(checkLevel.getUpdatedAt());
                }
                if (checkLevel.getUpdateBy() != null) {
                    existingCheckLevel.setUpdateBy(checkLevel.getUpdateBy());
                }

                return existingCheckLevel;
            })
            .map(checkLevelRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, checkLevel.getId().toString())
        );
    }

    /**
     * {@code GET  /check-levels} : get all the checkLevels.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of checkLevels in body.
     */
    @GetMapping("")
    public List<CheckLevel> getAllCheckLevels() {
        log.debug("REST request to get all CheckLevels");
        return checkLevelRepository.findAll();
    }

    /**
     * {@code GET  /check-levels/:id} : get the "id" checkLevel.
     *
     * @param id the id of the checkLevel to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the checkLevel, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CheckLevel> getCheckLevel(@PathVariable("id") Long id) {
        log.debug("REST request to get CheckLevel : {}", id);
        Optional<CheckLevel> checkLevel = checkLevelRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(checkLevel);
    }

    /**
     * {@code DELETE  /check-levels/:id} : delete the "id" checkLevel.
     *
     * @param id the id of the checkLevel to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCheckLevel(@PathVariable("id") Long id) {
        log.debug("REST request to delete CheckLevel : {}", id);
        checkLevelRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
