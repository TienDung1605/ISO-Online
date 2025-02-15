package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Script;
import com.mycompany.myapp.repository.ScriptRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Script}.
 */
@RestController
@RequestMapping("/api/scripts")
@Transactional
public class ScriptResource {

    private final Logger log = LoggerFactory.getLogger(ScriptResource.class);

    private static final String ENTITY_NAME = "script";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ScriptRepository scriptRepository;

    public ScriptResource(ScriptRepository scriptRepository) {
        this.scriptRepository = scriptRepository;
    }

    /**
     * {@code POST  /scripts} : Create a new script.
     *
     * @param script the script to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new script, or with status {@code 400 (Bad Request)} if the script has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Script> createScript(@RequestBody Script script) throws URISyntaxException {
        log.debug("REST request to save Script : {}", script);
        if (script.getId() != null) {
            throw new BadRequestAlertException("A new script cannot already have an ID", ENTITY_NAME, "idexists");
        }
        script = scriptRepository.save(script);
        return ResponseEntity.created(new URI("/api/scripts/" + script.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, script.getId().toString()))
            .body(script);
    }

    /**
     * {@code PUT  /scripts/:id} : Updates an existing script.
     *
     * @param id the id of the script to save.
     * @param script the script to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated script,
     * or with status {@code 400 (Bad Request)} if the script is not valid,
     * or with status {@code 500 (Internal Server Error)} if the script couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Script> updateScript(@PathVariable(value = "id", required = false) final Long id, @RequestBody Script script)
        throws URISyntaxException {
        log.debug("REST request to update Script : {}, {}", id, script);
        if (script.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, script.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!scriptRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        script = scriptRepository.save(script);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, script.getId().toString()))
            .body(script);
    }

    /**
     * {@code PATCH  /scripts/:id} : Partial updates given fields of an existing script, field will ignore if it is null
     *
     * @param id the id of the script to save.
     * @param script the script to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated script,
     * or with status {@code 400 (Bad Request)} if the script is not valid,
     * or with status {@code 404 (Not Found)} if the script is not found,
     * or with status {@code 500 (Internal Server Error)} if the script couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Script> partialUpdateScript(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Script script
    ) throws URISyntaxException {
        log.debug("REST request to partial update Script partially : {}, {}", id, script);
        if (script.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, script.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!scriptRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Script> result = scriptRepository
            .findById(script.getId())
            .map(existingScript -> {
                if (script.getScriptCode() != null) {
                    existingScript.setScriptCode(script.getScriptCode());
                }
                if (script.getScriptName() != null) {
                    existingScript.setScriptName(script.getScriptName());
                }
                if (script.getTimeStart() != null) {
                    existingScript.setTimeStart(script.getTimeStart());
                }
                if (script.getTimeEnd() != null) {
                    existingScript.setTimeEnd(script.getTimeEnd());
                }
                if (script.getStatus() != null) {
                    existingScript.setStatus(script.getStatus());
                }
                if (script.getUpdateBy() != null) {
                    existingScript.setUpdateBy(script.getUpdateBy());
                }
                if (script.getFrequency() != null) {
                    existingScript.setFrequency(script.getFrequency());
                }
                if (script.getSubjectOfAssetmentPlan() != null) {
                    existingScript.setSubjectOfAssetmentPlan(script.getSubjectOfAssetmentPlan());
                }
                if (script.getCodePlan() != null) {
                    existingScript.setCodePlan(script.getCodePlan());
                }
                if (script.getNamePlan() != null) {
                    existingScript.setNamePlan(script.getNamePlan());
                }
                if (script.getTimeCheck() != null) {
                    existingScript.setTimeCheck(script.getTimeCheck());
                }
                if (script.getCreatedAt() != null) {
                    existingScript.setCreatedAt(script.getCreatedAt());
                }
                if (script.getUpdatedAt() != null) {
                    existingScript.setUpdatedAt(script.getUpdatedAt());
                }
                if (script.getParticipant() != null) {
                    existingScript.setParticipant(script.getParticipant());
                }

                return existingScript;
            })
            .map(scriptRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, script.getId().toString())
        );
    }

    /**
     * {@code GET  /scripts} : get all the scripts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of scripts in body.
     */
    @GetMapping("")
    public List<Script> getAllScripts() {
        log.debug("REST request to get all Scripts");
        return scriptRepository.findAll();
    }

    /**
     * {@code GET  /scripts/:id} : get the "id" script.
     *
     * @param id the id of the script to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the script, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Script> getScript(@PathVariable("id") Long id) {
        log.debug("REST request to get Script : {}", id);
        Optional<Script> script = scriptRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(script);
    }

    /**
     * {@code DELETE  /scripts/:id} : delete the "id" script.
     *
     * @param id the id of the script to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScript(@PathVariable("id") Long id) {
        log.debug("REST request to delete Script : {}", id);
        scriptRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
