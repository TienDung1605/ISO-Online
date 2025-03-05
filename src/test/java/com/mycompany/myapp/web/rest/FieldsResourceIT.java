package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.FieldsAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Fields;
import com.mycompany.myapp.repository.FieldsRepository;
import com.mycompany.myapp.service.dto.FieldsDTO;
import com.mycompany.myapp.service.mapper.FieldsMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FieldsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FieldsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_FIELD_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIELD_NAME = "BBBBBBBBBB";

    private static final Long DEFAULT_SOURCE_ID = 1L;
    private static final Long UPDATED_SOURCE_ID = 2L;

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_CREATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATE_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/fields";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private FieldsRepository fieldsRepository;

    @Autowired
    private FieldsMapper fieldsMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFieldsMockMvc;

    private Fields fields;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fields createEntity(EntityManager em) {
        Fields fields = new Fields()
            .name(DEFAULT_NAME)
            .fieldName(DEFAULT_FIELD_NAME)
            .sourceId(DEFAULT_SOURCE_ID)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .createBy(DEFAULT_CREATE_BY);
        return fields;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fields createUpdatedEntity(EntityManager em) {
        Fields fields = new Fields()
            .name(UPDATED_NAME)
            .fieldName(UPDATED_FIELD_NAME)
            .sourceId(UPDATED_SOURCE_ID)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .createBy(UPDATED_CREATE_BY);
        return fields;
    }

    @BeforeEach
    public void initTest() {
        fields = createEntity(em);
    }

    @Test
    @Transactional
    void createFields() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Fields
        FieldsDTO fieldsDTO = fieldsMapper.toDto(fields);
        var returnedFieldsDTO = om.readValue(
            restFieldsMockMvc
                .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(fieldsDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            FieldsDTO.class
        );

        // Validate the Fields in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedFields = fieldsMapper.toEntity(returnedFieldsDTO);
        assertFieldsUpdatableFieldsEquals(returnedFields, getPersistedFields(returnedFields));
    }

    @Test
    @Transactional
    void createFieldsWithExistingId() throws Exception {
        // Create the Fields with an existing ID
        fields.setId(1L);
        FieldsDTO fieldsDTO = fieldsMapper.toDto(fields);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFieldsMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(fieldsDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Fields in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFields() throws Exception {
        // Initialize the database
        fieldsRepository.saveAndFlush(fields);

        // Get all the fieldsList
        restFieldsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fields.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].fieldName").value(hasItem(DEFAULT_FIELD_NAME)))
            .andExpect(jsonPath("$.[*].sourceId").value(hasItem(DEFAULT_SOURCE_ID.intValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].createBy").value(hasItem(DEFAULT_CREATE_BY)));
    }

    @Test
    @Transactional
    void getFields() throws Exception {
        // Initialize the database
        fieldsRepository.saveAndFlush(fields);

        // Get the fields
        restFieldsMockMvc
            .perform(get(ENTITY_API_URL_ID, fields.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(fields.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.fieldName").value(DEFAULT_FIELD_NAME))
            .andExpect(jsonPath("$.sourceId").value(DEFAULT_SOURCE_ID.intValue()))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.createBy").value(DEFAULT_CREATE_BY));
    }

    @Test
    @Transactional
    void getNonExistingFields() throws Exception {
        // Get the fields
        restFieldsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFields() throws Exception {
        // Initialize the database
        fieldsRepository.saveAndFlush(fields);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the fields
        Fields updatedFields = fieldsRepository.findById(fields.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedFields are not directly saved in db
        em.detach(updatedFields);
        updatedFields
            .name(UPDATED_NAME)
            .fieldName(UPDATED_FIELD_NAME)
            .sourceId(UPDATED_SOURCE_ID)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .createBy(UPDATED_CREATE_BY);
        FieldsDTO fieldsDTO = fieldsMapper.toDto(updatedFields);

        restFieldsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fieldsDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(fieldsDTO))
            )
            .andExpect(status().isOk());

        // Validate the Fields in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedFieldsToMatchAllProperties(updatedFields);
    }

    @Test
    @Transactional
    void putNonExistingFields() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        fields.setId(longCount.incrementAndGet());

        // Create the Fields
        FieldsDTO fieldsDTO = fieldsMapper.toDto(fields);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFieldsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fieldsDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(fieldsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fields in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFields() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        fields.setId(longCount.incrementAndGet());

        // Create the Fields
        FieldsDTO fieldsDTO = fieldsMapper.toDto(fields);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFieldsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(fieldsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fields in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFields() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        fields.setId(longCount.incrementAndGet());

        // Create the Fields
        FieldsDTO fieldsDTO = fieldsMapper.toDto(fields);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFieldsMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(fieldsDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fields in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFieldsWithPatch() throws Exception {
        // Initialize the database
        fieldsRepository.saveAndFlush(fields);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the fields using partial update
        Fields partialUpdatedFields = new Fields();
        partialUpdatedFields.setId(fields.getId());

        partialUpdatedFields.fieldName(UPDATED_FIELD_NAME).updatedAt(UPDATED_UPDATED_AT);

        restFieldsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFields.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedFields))
            )
            .andExpect(status().isOk());

        // Validate the Fields in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertFieldsUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedFields, fields), getPersistedFields(fields));
    }

    @Test
    @Transactional
    void fullUpdateFieldsWithPatch() throws Exception {
        // Initialize the database
        fieldsRepository.saveAndFlush(fields);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the fields using partial update
        Fields partialUpdatedFields = new Fields();
        partialUpdatedFields.setId(fields.getId());

        partialUpdatedFields
            .name(UPDATED_NAME)
            .fieldName(UPDATED_FIELD_NAME)
            .sourceId(UPDATED_SOURCE_ID)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .createBy(UPDATED_CREATE_BY);

        restFieldsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFields.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedFields))
            )
            .andExpect(status().isOk());

        // Validate the Fields in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertFieldsUpdatableFieldsEquals(partialUpdatedFields, getPersistedFields(partialUpdatedFields));
    }

    @Test
    @Transactional
    void patchNonExistingFields() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        fields.setId(longCount.incrementAndGet());

        // Create the Fields
        FieldsDTO fieldsDTO = fieldsMapper.toDto(fields);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFieldsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, fieldsDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(fieldsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fields in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFields() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        fields.setId(longCount.incrementAndGet());

        // Create the Fields
        FieldsDTO fieldsDTO = fieldsMapper.toDto(fields);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFieldsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(fieldsDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fields in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFields() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        fields.setId(longCount.incrementAndGet());

        // Create the Fields
        FieldsDTO fieldsDTO = fieldsMapper.toDto(fields);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFieldsMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(fieldsDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fields in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFields() throws Exception {
        // Initialize the database
        fieldsRepository.saveAndFlush(fields);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the fields
        restFieldsMockMvc
            .perform(delete(ENTITY_API_URL_ID, fields.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return fieldsRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Fields getPersistedFields(Fields fields) {
        return fieldsRepository.findById(fields.getId()).orElseThrow();
    }

    protected void assertPersistedFieldsToMatchAllProperties(Fields expectedFields) {
        assertFieldsAllPropertiesEquals(expectedFields, getPersistedFields(expectedFields));
    }

    protected void assertPersistedFieldsToMatchUpdatableProperties(Fields expectedFields) {
        assertFieldsAllUpdatablePropertiesEquals(expectedFields, getPersistedFields(expectedFields));
    }
}
