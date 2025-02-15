package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Title;
import com.mycompany.myapp.repository.TitleRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Title}.
 */
@RestController
@RequestMapping("/api/titles")
@Transactional
public class TitleResource {

    private final Logger log = LoggerFactory.getLogger(TitleResource.class);

    private static final String ENTITY_NAME = "title";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TitleRepository titleRepository;

    public TitleResource(TitleRepository titleRepository) {
        this.titleRepository = titleRepository;
    }

    /**
     * {@code POST  /titles} : Create a new title.
     *
     * @param title the title to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new title, or with status {@code 400 (Bad Request)} if the title has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Title> createTitle(@RequestBody Title title) throws URISyntaxException {
        log.debug("REST request to save Title : {}", title);
        if (title.getId() != null) {
            throw new BadRequestAlertException("A new title cannot already have an ID", ENTITY_NAME, "idexists");
        }
        title = titleRepository.save(title);
        return ResponseEntity.created(new URI("/api/titles/" + title.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, title.getId().toString()))
            .body(title);
    }

    /**
     * {@code PUT  /titles/:id} : Updates an existing title.
     *
     * @param id the id of the title to save.
     * @param title the title to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated title,
     * or with status {@code 400 (Bad Request)} if the title is not valid,
     * or with status {@code 500 (Internal Server Error)} if the title couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Title> updateTitle(@PathVariable(value = "id", required = false) final Long id, @RequestBody Title title)
        throws URISyntaxException {
        log.debug("REST request to update Title : {}, {}", id, title);
        if (title.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, title.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!titleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        title = titleRepository.save(title);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, title.getId().toString()))
            .body(title);
    }

    /**
     * {@code PATCH  /titles/:id} : Partial updates given fields of an existing title, field will ignore if it is null
     *
     * @param id the id of the title to save.
     * @param title the title to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated title,
     * or with status {@code 400 (Bad Request)} if the title is not valid,
     * or with status {@code 404 (Not Found)} if the title is not found,
     * or with status {@code 500 (Internal Server Error)} if the title couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Title> partialUpdateTitle(@PathVariable(value = "id", required = false) final Long id, @RequestBody Title title)
        throws URISyntaxException {
        log.debug("REST request to partial update Title partially : {}, {}", id, title);
        if (title.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, title.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!titleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Title> result = titleRepository
            .findById(title.getId())
            .map(existingTitle -> {
                if (title.getName() != null) {
                    existingTitle.setName(title.getName());
                }
                if (title.getSource() != null) {
                    existingTitle.setSource(title.getSource());
                }
                if (title.getCreatedAt() != null) {
                    existingTitle.setCreatedAt(title.getCreatedAt());
                }
                if (title.getUpdatedAt() != null) {
                    existingTitle.setUpdatedAt(title.getUpdatedAt());
                }
                if (title.getDataType() != null) {
                    existingTitle.setDataType(title.getDataType());
                }
                if (title.getUpdateBy() != null) {
                    existingTitle.setUpdateBy(title.getUpdateBy());
                }
                if (title.getField() != null) {
                    existingTitle.setField(title.getField());
                }

                return existingTitle;
            })
            .map(titleRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, title.getId().toString())
        );
    }

    /**
     * {@code GET  /titles} : get all the titles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of titles in body.
     */
    @GetMapping("")
    public List<Title> getAllTitles() {
        log.debug("REST request to get all Titles");
        return titleRepository.findAll();
    }

    /**
     * {@code GET  /titles/:id} : get the "id" title.
     *
     * @param id the id of the title to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the title, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Title> getTitle(@PathVariable("id") Long id) {
        log.debug("REST request to get Title : {}", id);
        Optional<Title> title = titleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(title);
    }

    /**
     * {@code DELETE  /titles/:id} : delete the "id" title.
     *
     * @param id the id of the title to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTitle(@PathVariable("id") Long id) {
        log.debug("REST request to delete Title : {}", id);
        titleRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
