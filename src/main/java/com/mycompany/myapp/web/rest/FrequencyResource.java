package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Frequency;
import com.mycompany.myapp.repository.FrequencyRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Frequency}.
 */
@RestController
@RequestMapping("/api/frequencies")
@Transactional
public class FrequencyResource {

    private final Logger log = LoggerFactory.getLogger(FrequencyResource.class);

    private static final String ENTITY_NAME = "frequency";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FrequencyRepository frequencyRepository;

    public FrequencyResource(FrequencyRepository frequencyRepository) {
        this.frequencyRepository = frequencyRepository;
    }

    /**
     * {@code POST  /frequencies} : Create a new frequency.
     *
     * @param frequency the frequency to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new frequency, or with status {@code 400 (Bad Request)} if the frequency has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Frequency> createFrequency(@RequestBody Frequency frequency) throws URISyntaxException {
        log.debug("REST request to save Frequency : {}", frequency);
        if (frequency.getId() != null) {
            throw new BadRequestAlertException("A new frequency cannot already have an ID", ENTITY_NAME, "idexists");
        }
        frequency = frequencyRepository.save(frequency);
        return ResponseEntity.created(new URI("/api/frequencies/" + frequency.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, frequency.getId().toString()))
            .body(frequency);
    }

    /**
     * {@code PUT  /frequencies/:id} : Updates an existing frequency.
     *
     * @param id the id of the frequency to save.
     * @param frequency the frequency to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated frequency,
     * or with status {@code 400 (Bad Request)} if the frequency is not valid,
     * or with status {@code 500 (Internal Server Error)} if the frequency couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Frequency> updateFrequency(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Frequency frequency
    ) throws URISyntaxException {
        log.debug("REST request to update Frequency : {}, {}", id, frequency);
        if (frequency.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, frequency.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!frequencyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        frequency = frequencyRepository.save(frequency);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, frequency.getId().toString()))
            .body(frequency);
    }

    /**
     * {@code PATCH  /frequencies/:id} : Partial updates given fields of an existing frequency, field will ignore if it is null
     *
     * @param id the id of the frequency to save.
     * @param frequency the frequency to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated frequency,
     * or with status {@code 400 (Bad Request)} if the frequency is not valid,
     * or with status {@code 404 (Not Found)} if the frequency is not found,
     * or with status {@code 500 (Internal Server Error)} if the frequency couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Frequency> partialUpdateFrequency(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Frequency frequency
    ) throws URISyntaxException {
        log.debug("REST request to partial update Frequency partially : {}, {}", id, frequency);
        if (frequency.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, frequency.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!frequencyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Frequency> result = frequencyRepository
            .findById(frequency.getId())
            .map(existingFrequency -> {
                if (frequency.getName() != null) {
                    existingFrequency.setName(frequency.getName());
                }
                if (frequency.getCreatedAt() != null) {
                    existingFrequency.setCreatedAt(frequency.getCreatedAt());
                }
                if (frequency.getUpdatedAt() != null) {
                    existingFrequency.setUpdatedAt(frequency.getUpdatedAt());
                }
                if (frequency.getStatus() != null) {
                    existingFrequency.setStatus(frequency.getStatus());
                }
                if (frequency.getUpdateBy() != null) {
                    existingFrequency.setUpdateBy(frequency.getUpdateBy());
                }

                return existingFrequency;
            })
            .map(frequencyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, frequency.getId().toString())
        );
    }

    /**
     * {@code GET  /frequencies} : get all the frequencies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of frequencies in body.
     */
    @GetMapping("")
    public List<Frequency> getAllFrequencies() {
        log.debug("REST request to get all Frequencies");
        return frequencyRepository.findAll();
    }

    /**
     * {@code GET  /frequencies/:id} : get the "id" frequency.
     *
     * @param id the id of the frequency to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the frequency, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Frequency> getFrequency(@PathVariable("id") Long id) {
        log.debug("REST request to get Frequency : {}", id);
        Optional<Frequency> frequency = frequencyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(frequency);
    }

    /**
     * {@code DELETE  /frequencies/:id} : delete the "id" frequency.
     *
     * @param id the id of the frequency to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFrequency(@PathVariable("id") Long id) {
        log.debug("REST request to delete Frequency : {}", id);
        frequencyRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
