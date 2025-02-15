package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Convert;
import com.mycompany.myapp.repository.ConvertRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Convert}.
 */
@RestController
@RequestMapping("/api/converts")
@Transactional
public class ConvertResource {

    private final Logger log = LoggerFactory.getLogger(ConvertResource.class);

    private static final String ENTITY_NAME = "convert";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConvertRepository convertRepository;

    public ConvertResource(ConvertRepository convertRepository) {
        this.convertRepository = convertRepository;
    }

    /**
     * {@code POST  /converts} : Create a new convert.
     *
     * @param convert the convert to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new convert, or with status {@code 400 (Bad Request)} if the convert has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Convert> createConvert(@RequestBody Convert convert) throws URISyntaxException {
        log.debug("REST request to save Convert : {}", convert);
        if (convert.getId() != null) {
            throw new BadRequestAlertException("A new convert cannot already have an ID", ENTITY_NAME, "idexists");
        }
        convert = convertRepository.save(convert);
        return ResponseEntity.created(new URI("/api/converts/" + convert.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, convert.getId().toString()))
            .body(convert);
    }

    /**
     * {@code PUT  /converts/:id} : Updates an existing convert.
     *
     * @param id the id of the convert to save.
     * @param convert the convert to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated convert,
     * or with status {@code 400 (Bad Request)} if the convert is not valid,
     * or with status {@code 500 (Internal Server Error)} if the convert couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Convert> updateConvert(@PathVariable(value = "id", required = false) final Long id, @RequestBody Convert convert)
        throws URISyntaxException {
        log.debug("REST request to update Convert : {}, {}", id, convert);
        if (convert.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, convert.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!convertRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        convert = convertRepository.save(convert);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, convert.getId().toString()))
            .body(convert);
    }

    /**
     * {@code PATCH  /converts/:id} : Partial updates given fields of an existing convert, field will ignore if it is null
     *
     * @param id the id of the convert to save.
     * @param convert the convert to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated convert,
     * or with status {@code 400 (Bad Request)} if the convert is not valid,
     * or with status {@code 404 (Not Found)} if the convert is not found,
     * or with status {@code 500 (Internal Server Error)} if the convert couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Convert> partialUpdateConvert(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Convert convert
    ) throws URISyntaxException {
        log.debug("REST request to partial update Convert partially : {}, {}", id, convert);
        if (convert.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, convert.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!convertRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Convert> result = convertRepository
            .findById(convert.getId())
            .map(existingConvert -> {
                if (convert.getName() != null) {
                    existingConvert.setName(convert.getName());
                }
                if (convert.getType() != null) {
                    existingConvert.setType(convert.getType());
                }
                if (convert.getMark() != null) {
                    existingConvert.setMark(convert.getMark());
                }
                if (convert.getCreatedAt() != null) {
                    existingConvert.setCreatedAt(convert.getCreatedAt());
                }
                if (convert.getUpdatedAt() != null) {
                    existingConvert.setUpdatedAt(convert.getUpdatedAt());
                }
                if (convert.getUpdateBy() != null) {
                    existingConvert.setUpdateBy(convert.getUpdateBy());
                }
                if (convert.getScore() != null) {
                    existingConvert.setScore(convert.getScore());
                }
                if (convert.getCount() != null) {
                    existingConvert.setCount(convert.getCount());
                }

                return existingConvert;
            })
            .map(convertRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, convert.getId().toString())
        );
    }

    /**
     * {@code GET  /converts} : get all the converts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of converts in body.
     */
    @GetMapping("")
    public List<Convert> getAllConverts() {
        log.debug("REST request to get all Converts");
        return convertRepository.findAll();
    }

    /**
     * {@code GET  /converts/:id} : get the "id" convert.
     *
     * @param id the id of the convert to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the convert, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Convert> getConvert(@PathVariable("id") Long id) {
        log.debug("REST request to get Convert : {}", id);
        Optional<Convert> convert = convertRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(convert);
    }

    /**
     * {@code DELETE  /converts/:id} : delete the "id" convert.
     *
     * @param id the id of the convert to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConvert(@PathVariable("id") Long id) {
        log.debug("REST request to delete Convert : {}", id);
        convertRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
