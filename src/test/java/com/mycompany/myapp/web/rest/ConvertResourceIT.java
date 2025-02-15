package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ConvertAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Convert;
import com.mycompany.myapp.repository.ConvertRepository;
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
 * Integration tests for the {@link ConvertResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConvertResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_MARK = "AAAAAAAAAA";
    private static final String UPDATED_MARK = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_UPDATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_BY = "BBBBBBBBBB";

    private static final Integer DEFAULT_SCORE = 1;
    private static final Integer UPDATED_SCORE = 2;

    private static final Integer DEFAULT_COUNT = 1;
    private static final Integer UPDATED_COUNT = 2;

    private static final String ENTITY_API_URL = "/api/converts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ConvertRepository convertRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConvertMockMvc;

    private Convert convert;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Convert createEntity(EntityManager em) {
        Convert convert = new Convert()
            .name(DEFAULT_NAME)
            .type(DEFAULT_TYPE)
            .mark(DEFAULT_MARK)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .updateBy(DEFAULT_UPDATE_BY)
            .score(DEFAULT_SCORE)
            .count(DEFAULT_COUNT);
        return convert;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Convert createUpdatedEntity(EntityManager em) {
        Convert convert = new Convert()
            .name(UPDATED_NAME)
            .type(UPDATED_TYPE)
            .mark(UPDATED_MARK)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .score(UPDATED_SCORE)
            .count(UPDATED_COUNT);
        return convert;
    }

    @BeforeEach
    public void initTest() {
        convert = createEntity(em);
    }

    @Test
    @Transactional
    void createConvert() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Convert
        var returnedConvert = om.readValue(
            restConvertMockMvc
                .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(convert)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Convert.class
        );

        // Validate the Convert in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertConvertUpdatableFieldsEquals(returnedConvert, getPersistedConvert(returnedConvert));
    }

    @Test
    @Transactional
    void createConvertWithExistingId() throws Exception {
        // Create the Convert with an existing ID
        convert.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConvertMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(convert)))
            .andExpect(status().isBadRequest());

        // Validate the Convert in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConverts() throws Exception {
        // Initialize the database
        convertRepository.saveAndFlush(convert);

        // Get all the convertList
        restConvertMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(convert.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].mark").value(hasItem(DEFAULT_MARK)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)))
            .andExpect(jsonPath("$.[*].score").value(hasItem(DEFAULT_SCORE)))
            .andExpect(jsonPath("$.[*].count").value(hasItem(DEFAULT_COUNT)));
    }

    @Test
    @Transactional
    void getConvert() throws Exception {
        // Initialize the database
        convertRepository.saveAndFlush(convert);

        // Get the convert
        restConvertMockMvc
            .perform(get(ENTITY_API_URL_ID, convert.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(convert.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.mark").value(DEFAULT_MARK))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY))
            .andExpect(jsonPath("$.score").value(DEFAULT_SCORE))
            .andExpect(jsonPath("$.count").value(DEFAULT_COUNT));
    }

    @Test
    @Transactional
    void getNonExistingConvert() throws Exception {
        // Get the convert
        restConvertMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingConvert() throws Exception {
        // Initialize the database
        convertRepository.saveAndFlush(convert);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the convert
        Convert updatedConvert = convertRepository.findById(convert.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedConvert are not directly saved in db
        em.detach(updatedConvert);
        updatedConvert
            .name(UPDATED_NAME)
            .type(UPDATED_TYPE)
            .mark(UPDATED_MARK)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .score(UPDATED_SCORE)
            .count(UPDATED_COUNT);

        restConvertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConvert.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedConvert))
            )
            .andExpect(status().isOk());

        // Validate the Convert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedConvertToMatchAllProperties(updatedConvert);
    }

    @Test
    @Transactional
    void putNonExistingConvert() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        convert.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConvertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, convert.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(convert))
            )
            .andExpect(status().isBadRequest());

        // Validate the Convert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConvert() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        convert.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConvertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(convert))
            )
            .andExpect(status().isBadRequest());

        // Validate the Convert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConvert() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        convert.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConvertMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(convert)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Convert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConvertWithPatch() throws Exception {
        // Initialize the database
        convertRepository.saveAndFlush(convert);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the convert using partial update
        Convert partialUpdatedConvert = new Convert();
        partialUpdatedConvert.setId(convert.getId());

        partialUpdatedConvert.updateBy(UPDATED_UPDATE_BY);

        restConvertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConvert.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedConvert))
            )
            .andExpect(status().isOk());

        // Validate the Convert in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertConvertUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedConvert, convert), getPersistedConvert(convert));
    }

    @Test
    @Transactional
    void fullUpdateConvertWithPatch() throws Exception {
        // Initialize the database
        convertRepository.saveAndFlush(convert);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the convert using partial update
        Convert partialUpdatedConvert = new Convert();
        partialUpdatedConvert.setId(convert.getId());

        partialUpdatedConvert
            .name(UPDATED_NAME)
            .type(UPDATED_TYPE)
            .mark(UPDATED_MARK)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .score(UPDATED_SCORE)
            .count(UPDATED_COUNT);

        restConvertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConvert.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedConvert))
            )
            .andExpect(status().isOk());

        // Validate the Convert in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertConvertUpdatableFieldsEquals(partialUpdatedConvert, getPersistedConvert(partialUpdatedConvert));
    }

    @Test
    @Transactional
    void patchNonExistingConvert() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        convert.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConvertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, convert.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(convert))
            )
            .andExpect(status().isBadRequest());

        // Validate the Convert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConvert() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        convert.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConvertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(convert))
            )
            .andExpect(status().isBadRequest());

        // Validate the Convert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConvert() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        convert.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConvertMockMvc
            .perform(patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(convert)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Convert in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConvert() throws Exception {
        // Initialize the database
        convertRepository.saveAndFlush(convert);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the convert
        restConvertMockMvc
            .perform(delete(ENTITY_API_URL_ID, convert.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return convertRepository.count();
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

    protected Convert getPersistedConvert(Convert convert) {
        return convertRepository.findById(convert.getId()).orElseThrow();
    }

    protected void assertPersistedConvertToMatchAllProperties(Convert expectedConvert) {
        assertConvertAllPropertiesEquals(expectedConvert, getPersistedConvert(expectedConvert));
    }

    protected void assertPersistedConvertToMatchUpdatableProperties(Convert expectedConvert) {
        assertConvertAllUpdatablePropertiesEquals(expectedConvert, getPersistedConvert(expectedConvert));
    }
}
