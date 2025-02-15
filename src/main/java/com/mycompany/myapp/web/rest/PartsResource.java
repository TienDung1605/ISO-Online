package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Parts;
import com.mycompany.myapp.repository.PartsRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Parts}.
 */
@RestController
@RequestMapping("/api/parts")
@Transactional
public class PartsResource {

    private final Logger log = LoggerFactory.getLogger(PartsResource.class);

    private static final String ENTITY_NAME = "parts";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PartsRepository partsRepository;

    public PartsResource(PartsRepository partsRepository) {
        this.partsRepository = partsRepository;
    }

    /**
     * {@code POST  /parts} : Create a new parts.
     *
     * @param parts the parts to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new parts, or with status {@code 400 (Bad Request)} if the parts has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Parts> createParts(@RequestBody Parts parts) throws URISyntaxException {
        log.debug("REST request to save Parts : {}", parts);
        if (parts.getId() != null) {
            throw new BadRequestAlertException("A new parts cannot already have an ID", ENTITY_NAME, "idexists");
        }
        parts = partsRepository.save(parts);
        return ResponseEntity.created(new URI("/api/parts/" + parts.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, parts.getId().toString()))
            .body(parts);
    }

    /**
     * {@code PUT  /parts/:id} : Updates an existing parts.
     *
     * @param id the id of the parts to save.
     * @param parts the parts to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parts,
     * or with status {@code 400 (Bad Request)} if the parts is not valid,
     * or with status {@code 500 (Internal Server Error)} if the parts couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Parts> updateParts(@PathVariable(value = "id", required = false) final Long id, @RequestBody Parts parts)
        throws URISyntaxException {
        log.debug("REST request to update Parts : {}, {}", id, parts);
        if (parts.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parts.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!partsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        parts = partsRepository.save(parts);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, parts.getId().toString()))
            .body(parts);
    }

    /**
     * {@code PATCH  /parts/:id} : Partial updates given fields of an existing parts, field will ignore if it is null
     *
     * @param id the id of the parts to save.
     * @param parts the parts to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parts,
     * or with status {@code 400 (Bad Request)} if the parts is not valid,
     * or with status {@code 404 (Not Found)} if the parts is not found,
     * or with status {@code 500 (Internal Server Error)} if the parts couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Parts> partialUpdateParts(@PathVariable(value = "id", required = false) final Long id, @RequestBody Parts parts)
        throws URISyntaxException {
        log.debug("REST request to partial update Parts partially : {}, {}", id, parts);
        if (parts.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parts.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!partsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Parts> result = partsRepository
            .findById(parts.getId())
            .map(existingParts -> {
                if (parts.getName() != null) {
                    existingParts.setName(parts.getName());
                }
                if (parts.getStatus() != null) {
                    existingParts.setStatus(parts.getStatus());
                }
                if (parts.getCreatedAt() != null) {
                    existingParts.setCreatedAt(parts.getCreatedAt());
                }
                if (parts.getUpdatedAt() != null) {
                    existingParts.setUpdatedAt(parts.getUpdatedAt());
                }
                if (parts.getUpdateBy() != null) {
                    existingParts.setUpdateBy(parts.getUpdateBy());
                }

                return existingParts;
            })
            .map(partsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, parts.getId().toString())
        );
    }

    /**
     * {@code GET  /parts} : get all the parts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of parts in body.
     */
    @GetMapping("")
    public List<Parts> getAllParts() {
        log.debug("REST request to get all Parts");
        return partsRepository.findAll();
    }

    /**
     * {@code GET  /parts/:id} : get the "id" parts.
     *
     * @param id the id of the parts to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the parts, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Parts> getParts(@PathVariable("id") Long id) {
        log.debug("REST request to get Parts : {}", id);
        Optional<Parts> parts = partsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(parts);
    }

    /**
     * {@code DELETE  /parts/:id} : delete the "id" parts.
     *
     * @param id the id of the parts to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParts(@PathVariable("id") Long id) {
        log.debug("REST request to delete Parts : {}", id);
        partsRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
