package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Fields;
import com.mycompany.myapp.repository.FieldsRepository;
import com.mycompany.myapp.service.dto.FieldsDTO;
import com.mycompany.myapp.service.mapper.FieldsMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Fields}.
 */
@Service
@Transactional
public class FieldsService {

    private final Logger log = LoggerFactory.getLogger(FieldsService.class);

    private final FieldsRepository fieldsRepository;

    private final FieldsMapper fieldsMapper;

    public FieldsService(FieldsRepository fieldsRepository, FieldsMapper fieldsMapper) {
        this.fieldsRepository = fieldsRepository;
        this.fieldsMapper = fieldsMapper;
    }

    /**
     * Save a fields.
     *
     * @param fieldsDTO the entity to save.
     * @return the persisted entity.
     */
    public FieldsDTO save(FieldsDTO fieldsDTO) {
        log.debug("Request to save Fields : {}", fieldsDTO);
        Fields fields = fieldsMapper.toEntity(fieldsDTO);
        fields = fieldsRepository.save(fields);
        return fieldsMapper.toDto(fields);
    }

    /**
     * Update a fields.
     *
     * @param fieldsDTO the entity to save.
     * @return the persisted entity.
     */
    public FieldsDTO update(FieldsDTO fieldsDTO) {
        log.debug("Request to update Fields : {}", fieldsDTO);
        Fields fields = fieldsMapper.toEntity(fieldsDTO);
        fields = fieldsRepository.save(fields);
        return fieldsMapper.toDto(fields);
    }

    /**
     * Partially update a fields.
     *
     * @param fieldsDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<FieldsDTO> partialUpdate(FieldsDTO fieldsDTO) {
        log.debug("Request to partially update Fields : {}", fieldsDTO);

        return fieldsRepository
            .findById(fieldsDTO.getId())
            .map(existingFields -> {
                fieldsMapper.partialUpdate(existingFields, fieldsDTO);

                return existingFields;
            })
            .map(fieldsRepository::save)
            .map(fieldsMapper::toDto);
    }

    /**
     * Get all the fields.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<FieldsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Fields");
        return fieldsRepository.findAll(pageable).map(fieldsMapper::toDto);
    }

    /**
     * Get one fields by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<FieldsDTO> findOne(Long id) {
        log.debug("Request to get Fields : {}", id);
        return fieldsRepository.findById(id).map(fieldsMapper::toDto);
    }

    /**
     * Delete the fields by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Fields : {}", id);
        fieldsRepository.deleteById(id);
    }
}
