package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CheckerGroup;
import com.mycompany.myapp.repository.CheckerGroupRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.CheckerGroup}.
 */
@RestController
@RequestMapping("/api/checker-groups")
@Transactional
public class CheckerGroupResource {

    private final Logger log = LoggerFactory.getLogger(CheckerGroupResource.class);

    private static final String ENTITY_NAME = "checkerGroup";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CheckerGroupRepository checkerGroupRepository;

    public CheckerGroupResource(CheckerGroupRepository checkerGroupRepository) {
        this.checkerGroupRepository = checkerGroupRepository;
    }

    /**
     * {@code POST  /checker-groups} : Create a new checkerGroup.
     *
     * @param checkerGroup the checkerGroup to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new checkerGroup, or with status {@code 400 (Bad Request)} if the checkerGroup has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CheckerGroup> createCheckerGroup(@RequestBody CheckerGroup checkerGroup) throws URISyntaxException {
        log.debug("REST request to save CheckerGroup : {}", checkerGroup);
        if (checkerGroup.getId() != null) {
            throw new BadRequestAlertException("A new checkerGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        checkerGroup = checkerGroupRepository.save(checkerGroup);
        return ResponseEntity.created(new URI("/api/checker-groups/" + checkerGroup.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, checkerGroup.getId().toString()))
            .body(checkerGroup);
    }

    /**
     * {@code PUT  /checker-groups/:id} : Updates an existing checkerGroup.
     *
     * @param id the id of the checkerGroup to save.
     * @param checkerGroup the checkerGroup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated checkerGroup,
     * or with status {@code 400 (Bad Request)} if the checkerGroup is not valid,
     * or with status {@code 500 (Internal Server Error)} if the checkerGroup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CheckerGroup> updateCheckerGroup(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CheckerGroup checkerGroup
    ) throws URISyntaxException {
        log.debug("REST request to update CheckerGroup : {}, {}", id, checkerGroup);
        if (checkerGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, checkerGroup.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!checkerGroupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        checkerGroup = checkerGroupRepository.save(checkerGroup);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, checkerGroup.getId().toString()))
            .body(checkerGroup);
    }

    /**
     * {@code PATCH  /checker-groups/:id} : Partial updates given fields of an existing checkerGroup, field will ignore if it is null
     *
     * @param id the id of the checkerGroup to save.
     * @param checkerGroup the checkerGroup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated checkerGroup,
     * or with status {@code 400 (Bad Request)} if the checkerGroup is not valid,
     * or with status {@code 404 (Not Found)} if the checkerGroup is not found,
     * or with status {@code 500 (Internal Server Error)} if the checkerGroup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CheckerGroup> partialUpdateCheckerGroup(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CheckerGroup checkerGroup
    ) throws URISyntaxException {
        log.debug("REST request to partial update CheckerGroup partially : {}, {}", id, checkerGroup);
        if (checkerGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, checkerGroup.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!checkerGroupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CheckerGroup> result = checkerGroupRepository
            .findById(checkerGroup.getId())
            .map(existingCheckerGroup -> {
                if (checkerGroup.getName() != null) {
                    existingCheckerGroup.setName(checkerGroup.getName());
                }
                if (checkerGroup.getStatus() != null) {
                    existingCheckerGroup.setStatus(checkerGroup.getStatus());
                }
                if (checkerGroup.getCreatedAt() != null) {
                    existingCheckerGroup.setCreatedAt(checkerGroup.getCreatedAt());
                }
                if (checkerGroup.getUpdatedAt() != null) {
                    existingCheckerGroup.setUpdatedAt(checkerGroup.getUpdatedAt());
                }
                if (checkerGroup.getUpdateBy() != null) {
                    existingCheckerGroup.setUpdateBy(checkerGroup.getUpdateBy());
                }

                return existingCheckerGroup;
            })
            .map(checkerGroupRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, checkerGroup.getId().toString())
        );
    }

    /**
     * {@code GET  /checker-groups} : get all the checkerGroups.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of checkerGroups in body.
     */
    @GetMapping("")
    public List<CheckerGroup> getAllCheckerGroups() {
        log.debug("REST request to get all CheckerGroups");
        return checkerGroupRepository.findAll();
    }

    /**
     * {@code GET  /checker-groups/:id} : get the "id" checkerGroup.
     *
     * @param id the id of the checkerGroup to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the checkerGroup, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CheckerGroup> getCheckerGroup(@PathVariable("id") Long id) {
        log.debug("REST request to get CheckerGroup : {}", id);
        Optional<CheckerGroup> checkerGroup = checkerGroupRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(checkerGroup);
    }

    /**
     * {@code DELETE  /checker-groups/:id} : delete the "id" checkerGroup.
     *
     * @param id the id of the checkerGroup to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCheckerGroup(@PathVariable("id") Long id) {
        log.debug("REST request to delete CheckerGroup : {}", id);
        checkerGroupRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
