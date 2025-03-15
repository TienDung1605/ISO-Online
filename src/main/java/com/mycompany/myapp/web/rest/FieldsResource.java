package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.FieldsRepository;
import com.mycompany.myapp.service.FieldsService;
import com.mycompany.myapp.service.dto.FieldsDTO;
import com.mycompany.myapp.service.dto.FieldsRespone;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Fields}.
 */
@RestController
@RequestMapping("/api/fields")
public class FieldsResource {

    private final Logger log = LoggerFactory.getLogger(FieldsResource.class);

    private static final String ENTITY_NAME = "fields";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FieldsService fieldsService;

    private final FieldsRepository fieldsRepository;

    public FieldsResource(FieldsService fieldsService, FieldsRepository fieldsRepository) {
        this.fieldsService = fieldsService;
        this.fieldsRepository = fieldsRepository;
    }

    /**
     * {@code POST  /fields} : Create a new fields.
     *
     * @param fieldsDTO the fieldsDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fieldsDTO, or with status {@code 400 (Bad Request)} if the fields has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<FieldsDTO> createFields(@RequestBody FieldsDTO fieldsDTO) throws URISyntaxException {
        log.debug("REST request to save Fields : {}", fieldsDTO);
        if (fieldsDTO.getId() != null) {
            throw new BadRequestAlertException("A new fields cannot already have an ID", ENTITY_NAME, "idexists");
        }
        fieldsDTO = fieldsService.save(fieldsDTO);
        return ResponseEntity.created(new URI("/api/fields/" + fieldsDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, fieldsDTO.getId().toString()))
            .body(fieldsDTO);
    }

    /**
     * {@code PUT  /fields/:id} : Updates an existing fields.
     *
     * @param id the id of the fieldsDTO to save.
     * @param fieldsDTO the fieldsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fieldsDTO,
     * or with status {@code 400 (Bad Request)} if the fieldsDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fieldsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<FieldsDTO> updateFields(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FieldsDTO fieldsDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Fields : {}, {}", id, fieldsDTO);
        if (fieldsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fieldsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fieldsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        fieldsDTO = fieldsService.update(fieldsDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fieldsDTO.getId().toString()))
            .body(fieldsDTO);
    }

    /**
     * {@code PATCH  /fields/:id} : Partial updates given fields of an existing fields, field will ignore if it is null
     *
     * @param id the id of the fieldsDTO to save.
     * @param fieldsDTO the fieldsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fieldsDTO,
     * or with status {@code 400 (Bad Request)} if the fieldsDTO is not valid,
     * or with status {@code 404 (Not Found)} if the fieldsDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the fieldsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FieldsDTO> partialUpdateFields(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FieldsDTO fieldsDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Fields partially : {}, {}", id, fieldsDTO);
        if (fieldsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fieldsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fieldsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FieldsDTO> result = fieldsService.partialUpdate(fieldsDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fieldsDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /fields} : get all the fields.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fields in body.
     */
    @GetMapping("")
    public ResponseEntity<List<FieldsDTO>> getAllFields(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Fields");
        Page<FieldsDTO> page = fieldsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/all")
    public List<FieldsRespone> getAllFieldsCusTom() {
        List<FieldsRespone> fieldsRespones = this.fieldsRepository.getAllListFields();
        return fieldsRespones;
    }

    /**
     * {@code GET  /fields/:id} : get the "id" fields.
     *
     * @param id the id of the fieldsDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fieldsDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<FieldsDTO> getFields(@PathVariable("id") Long id) {
        log.debug("REST request to get Fields : {}", id);
        Optional<FieldsDTO> fieldsDTO = fieldsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(fieldsDTO);
    }

    /**
     * {@code DELETE  /fields/:id} : delete the "id" fields.
     *
     * @param id the id of the fieldsDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFields(@PathVariable("id") Long id) {
        log.debug("REST request to delete Fields : {}", id);
        fieldsService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/list/{name}")
    public List<Object> getAllFieldsInfo(@PathVariable String name) {
        List<Object> list = this.fieldsRepository.getAllFieldInfo(name);
        return list;
    }
}
