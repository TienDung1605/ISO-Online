package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CriteriaGroup;
import com.mycompany.myapp.repository.CriteriaGroupRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.CriteriaGroup}.
 */
@RestController
@RequestMapping("/api/criteria-groups")
@Transactional
public class CriteriaGroupResource {

    private final Logger log = LoggerFactory.getLogger(CriteriaGroupResource.class);

    private static final String ENTITY_NAME = "criteriaGroup";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CriteriaGroupRepository criteriaGroupRepository;

    public CriteriaGroupResource(CriteriaGroupRepository criteriaGroupRepository) {
        this.criteriaGroupRepository = criteriaGroupRepository;
    }

    /**
     * {@code POST  /criteria-groups} : Create a new criteriaGroup.
     *
     * @param criteriaGroup the criteriaGroup to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new criteriaGroup, or with status {@code 400 (Bad Request)} if the criteriaGroup has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CriteriaGroup> createCriteriaGroup(@RequestBody CriteriaGroup criteriaGroup) throws URISyntaxException {
        log.debug("REST request to save CriteriaGroup : {}", criteriaGroup);
        if (criteriaGroup.getId() != null) {
            throw new BadRequestAlertException("A new criteriaGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        criteriaGroup = criteriaGroupRepository.save(criteriaGroup);
        return ResponseEntity.created(new URI("/api/criteria-groups/" + criteriaGroup.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, criteriaGroup.getId().toString()))
            .body(criteriaGroup);
    }

    /**
     * {@code PUT  /criteria-groups/:id} : Updates an existing criteriaGroup.
     *
     * @param id the id of the criteriaGroup to save.
     * @param criteriaGroup the criteriaGroup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated criteriaGroup,
     * or with status {@code 400 (Bad Request)} if the criteriaGroup is not valid,
     * or with status {@code 500 (Internal Server Error)} if the criteriaGroup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CriteriaGroup> updateCriteriaGroup(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CriteriaGroup criteriaGroup
    ) throws URISyntaxException {
        log.debug("REST request to update CriteriaGroup : {}, {}", id, criteriaGroup);
        if (criteriaGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, criteriaGroup.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!criteriaGroupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        criteriaGroup = criteriaGroupRepository.save(criteriaGroup);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, criteriaGroup.getId().toString()))
            .body(criteriaGroup);
    }

    /**
     * {@code PATCH  /criteria-groups/:id} : Partial updates given fields of an existing criteriaGroup, field will ignore if it is null
     *
     * @param id the id of the criteriaGroup to save.
     * @param criteriaGroup the criteriaGroup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated criteriaGroup,
     * or with status {@code 400 (Bad Request)} if the criteriaGroup is not valid,
     * or with status {@code 404 (Not Found)} if the criteriaGroup is not found,
     * or with status {@code 500 (Internal Server Error)} if the criteriaGroup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CriteriaGroup> partialUpdateCriteriaGroup(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CriteriaGroup criteriaGroup
    ) throws URISyntaxException {
        log.debug("REST request to partial update CriteriaGroup partially : {}, {}", id, criteriaGroup);
        if (criteriaGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, criteriaGroup.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!criteriaGroupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CriteriaGroup> result = criteriaGroupRepository
            .findById(criteriaGroup.getId())
            .map(existingCriteriaGroup -> {
                if (criteriaGroup.getName() != null) {
                    existingCriteriaGroup.setName(criteriaGroup.getName());
                }
                if (criteriaGroup.getStatus() != null) {
                    existingCriteriaGroup.setStatus(criteriaGroup.getStatus());
                }
                if (criteriaGroup.getCreatedAt() != null) {
                    existingCriteriaGroup.setCreatedAt(criteriaGroup.getCreatedAt());
                }
                if (criteriaGroup.getUpdatedAt() != null) {
                    existingCriteriaGroup.setUpdatedAt(criteriaGroup.getUpdatedAt());
                }
                if (criteriaGroup.getUpdateBy() != null) {
                    existingCriteriaGroup.setUpdateBy(criteriaGroup.getUpdateBy());
                }

                return existingCriteriaGroup;
            })
            .map(criteriaGroupRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, criteriaGroup.getId().toString())
        );
    }

    /**
     * {@code GET  /criteria-groups} : get all the criteriaGroups.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of criteriaGroups in body.
     */
    @GetMapping("")
    public List<CriteriaGroup> getAllCriteriaGroups() {
        log.debug("REST request to get all CriteriaGroups");
        return criteriaGroupRepository.findAll();
    }

    /**
     * {@code GET  /criteria-groups/:id} : get the "id" criteriaGroup.
     *
     * @param id the id of the criteriaGroup to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the criteriaGroup, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CriteriaGroup> getCriteriaGroup(@PathVariable("id") Long id) {
        log.debug("REST request to get CriteriaGroup : {}", id);
        Optional<CriteriaGroup> criteriaGroup = criteriaGroupRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(criteriaGroup);
    }

    /**
     * {@code DELETE  /criteria-groups/:id} : delete the "id" criteriaGroup.
     *
     * @param id the id of the criteriaGroup to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCriteriaGroup(@PathVariable("id") Long id) {
        log.debug("REST request to delete CriteriaGroup : {}", id);
        criteriaGroupRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
