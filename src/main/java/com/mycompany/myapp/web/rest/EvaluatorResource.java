package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Evaluator;
import com.mycompany.myapp.repository.EvaluatorRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Evaluator}.
 */
@RestController
@RequestMapping("/api/evaluators")
@Transactional
public class EvaluatorResource {

    private final Logger log = LoggerFactory.getLogger(EvaluatorResource.class);

    private static final String ENTITY_NAME = "evaluator";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EvaluatorRepository evaluatorRepository;

    public EvaluatorResource(EvaluatorRepository evaluatorRepository) {
        this.evaluatorRepository = evaluatorRepository;
    }

    /**
     * {@code POST  /evaluators} : Create a new evaluator.
     *
     * @param evaluator the evaluator to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new evaluator, or with status {@code 400 (Bad Request)} if the evaluator has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Evaluator> createEvaluator(@RequestBody Evaluator evaluator) throws URISyntaxException {
        log.debug("REST request to save Evaluator : {}", evaluator);
        if (evaluator.getId() != null) {
            throw new BadRequestAlertException("A new evaluator cannot already have an ID", ENTITY_NAME, "idexists");
        }
        evaluator = evaluatorRepository.save(evaluator);
        return ResponseEntity.created(new URI("/api/evaluators/" + evaluator.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, evaluator.getId().toString()))
            .body(evaluator);
    }

    /**
     * {@code PUT  /evaluators/:id} : Updates an existing evaluator.
     *
     * @param id the id of the evaluator to save.
     * @param evaluator the evaluator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated evaluator,
     * or with status {@code 400 (Bad Request)} if the evaluator is not valid,
     * or with status {@code 500 (Internal Server Error)} if the evaluator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Evaluator> updateEvaluator(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Evaluator evaluator
    ) throws URISyntaxException {
        log.debug("REST request to update Evaluator : {}, {}", id, evaluator);
        if (evaluator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, evaluator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!evaluatorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        evaluator = evaluatorRepository.save(evaluator);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, evaluator.getId().toString()))
            .body(evaluator);
    }

    /**
     * {@code PATCH  /evaluators/:id} : Partial updates given fields of an existing evaluator, field will ignore if it is null
     *
     * @param id the id of the evaluator to save.
     * @param evaluator the evaluator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated evaluator,
     * or with status {@code 400 (Bad Request)} if the evaluator is not valid,
     * or with status {@code 404 (Not Found)} if the evaluator is not found,
     * or with status {@code 500 (Internal Server Error)} if the evaluator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Evaluator> partialUpdateEvaluator(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Evaluator evaluator
    ) throws URISyntaxException {
        log.debug("REST request to partial update Evaluator partially : {}, {}", id, evaluator);
        if (evaluator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, evaluator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!evaluatorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Evaluator> result = evaluatorRepository
            .findById(evaluator.getId())
            .map(existingEvaluator -> {
                if (evaluator.getName() != null) {
                    existingEvaluator.setName(evaluator.getName());
                }
                if (evaluator.getUserGroupId() != null) {
                    existingEvaluator.setUserGroupId(evaluator.getUserGroupId());
                }
                if (evaluator.getCreatedAt() != null) {
                    existingEvaluator.setCreatedAt(evaluator.getCreatedAt());
                }
                if (evaluator.getUpdatedAt() != null) {
                    existingEvaluator.setUpdatedAt(evaluator.getUpdatedAt());
                }
                if (evaluator.getStatus() != null) {
                    existingEvaluator.setStatus(evaluator.getStatus());
                }
                if (evaluator.getUpdateBy() != null) {
                    existingEvaluator.setUpdateBy(evaluator.getUpdateBy());
                }

                return existingEvaluator;
            })
            .map(evaluatorRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, evaluator.getId().toString())
        );
    }

    /**
     * {@code GET  /evaluators} : get all the evaluators.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of evaluators in body.
     */
    @GetMapping("")
    public List<Evaluator> getAllEvaluators() {
        log.debug("REST request to get all Evaluators");
        return evaluatorRepository.findAll();
    }

    /**
     * {@code GET  /evaluators/:id} : get the "id" evaluator.
     *
     * @param id the id of the evaluator to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the evaluator, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Evaluator> getEvaluator(@PathVariable("id") Long id) {
        log.debug("REST request to get Evaluator : {}", id);
        Optional<Evaluator> evaluator = evaluatorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(evaluator);
    }

    /**
     * {@code DELETE  /evaluators/:id} : delete the "id" evaluator.
     *
     * @param id the id of the evaluator to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvaluator(@PathVariable("id") Long id) {
        log.debug("REST request to delete Evaluator : {}", id);
        evaluatorRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
