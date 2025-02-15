package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.FrequencyAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Frequency;
import com.mycompany.myapp.repository.FrequencyRepository;
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
 * Integration tests for the {@link FrequencyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FrequencyResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_UPDATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/frequencies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private FrequencyRepository frequencyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFrequencyMockMvc;

    private Frequency frequency;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Frequency createEntity(EntityManager em) {
        Frequency frequency = new Frequency()
            .name(DEFAULT_NAME)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .status(DEFAULT_STATUS)
            .updateBy(DEFAULT_UPDATE_BY);
        return frequency;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Frequency createUpdatedEntity(EntityManager em) {
        Frequency frequency = new Frequency()
            .name(UPDATED_NAME)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .status(UPDATED_STATUS)
            .updateBy(UPDATED_UPDATE_BY);
        return frequency;
    }

    @BeforeEach
    public void initTest() {
        frequency = createEntity(em);
    }

    @Test
    @Transactional
    void createFrequency() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Frequency
        var returnedFrequency = om.readValue(
            restFrequencyMockMvc
                .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(frequency)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Frequency.class
        );

        // Validate the Frequency in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertFrequencyUpdatableFieldsEquals(returnedFrequency, getPersistedFrequency(returnedFrequency));
    }

    @Test
    @Transactional
    void createFrequencyWithExistingId() throws Exception {
        // Create the Frequency with an existing ID
        frequency.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFrequencyMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(frequency)))
            .andExpect(status().isBadRequest());

        // Validate the Frequency in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFrequencies() throws Exception {
        // Initialize the database
        frequencyRepository.saveAndFlush(frequency);

        // Get all the frequencyList
        restFrequencyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(frequency.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)));
    }

    @Test
    @Transactional
    void getFrequency() throws Exception {
        // Initialize the database
        frequencyRepository.saveAndFlush(frequency);

        // Get the frequency
        restFrequencyMockMvc
            .perform(get(ENTITY_API_URL_ID, frequency.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(frequency.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY));
    }

    @Test
    @Transactional
    void getNonExistingFrequency() throws Exception {
        // Get the frequency
        restFrequencyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFrequency() throws Exception {
        // Initialize the database
        frequencyRepository.saveAndFlush(frequency);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the frequency
        Frequency updatedFrequency = frequencyRepository.findById(frequency.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedFrequency are not directly saved in db
        em.detach(updatedFrequency);
        updatedFrequency
            .name(UPDATED_NAME)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .status(UPDATED_STATUS)
            .updateBy(UPDATED_UPDATE_BY);

        restFrequencyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFrequency.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedFrequency))
            )
            .andExpect(status().isOk());

        // Validate the Frequency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedFrequencyToMatchAllProperties(updatedFrequency);
    }

    @Test
    @Transactional
    void putNonExistingFrequency() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        frequency.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFrequencyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, frequency.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(frequency))
            )
            .andExpect(status().isBadRequest());

        // Validate the Frequency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFrequency() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        frequency.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFrequencyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(frequency))
            )
            .andExpect(status().isBadRequest());

        // Validate the Frequency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFrequency() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        frequency.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFrequencyMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(frequency)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Frequency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFrequencyWithPatch() throws Exception {
        // Initialize the database
        frequencyRepository.saveAndFlush(frequency);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the frequency using partial update
        Frequency partialUpdatedFrequency = new Frequency();
        partialUpdatedFrequency.setId(frequency.getId());

        partialUpdatedFrequency.name(UPDATED_NAME).createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);

        restFrequencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFrequency.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedFrequency))
            )
            .andExpect(status().isOk());

        // Validate the Frequency in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertFrequencyUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedFrequency, frequency),
            getPersistedFrequency(frequency)
        );
    }

    @Test
    @Transactional
    void fullUpdateFrequencyWithPatch() throws Exception {
        // Initialize the database
        frequencyRepository.saveAndFlush(frequency);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the frequency using partial update
        Frequency partialUpdatedFrequency = new Frequency();
        partialUpdatedFrequency.setId(frequency.getId());

        partialUpdatedFrequency
            .name(UPDATED_NAME)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .status(UPDATED_STATUS)
            .updateBy(UPDATED_UPDATE_BY);

        restFrequencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFrequency.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedFrequency))
            )
            .andExpect(status().isOk());

        // Validate the Frequency in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertFrequencyUpdatableFieldsEquals(partialUpdatedFrequency, getPersistedFrequency(partialUpdatedFrequency));
    }

    @Test
    @Transactional
    void patchNonExistingFrequency() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        frequency.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFrequencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, frequency.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(frequency))
            )
            .andExpect(status().isBadRequest());

        // Validate the Frequency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFrequency() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        frequency.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFrequencyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(frequency))
            )
            .andExpect(status().isBadRequest());

        // Validate the Frequency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFrequency() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        frequency.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFrequencyMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(frequency))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Frequency in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFrequency() throws Exception {
        // Initialize the database
        frequencyRepository.saveAndFlush(frequency);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the frequency
        restFrequencyMockMvc
            .perform(delete(ENTITY_API_URL_ID, frequency.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return frequencyRepository.count();
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

    protected Frequency getPersistedFrequency(Frequency frequency) {
        return frequencyRepository.findById(frequency.getId()).orElseThrow();
    }

    protected void assertPersistedFrequencyToMatchAllProperties(Frequency expectedFrequency) {
        assertFrequencyAllPropertiesEquals(expectedFrequency, getPersistedFrequency(expectedFrequency));
    }

    protected void assertPersistedFrequencyToMatchUpdatableProperties(Frequency expectedFrequency) {
        assertFrequencyAllUpdatablePropertiesEquals(expectedFrequency, getPersistedFrequency(expectedFrequency));
    }
}
