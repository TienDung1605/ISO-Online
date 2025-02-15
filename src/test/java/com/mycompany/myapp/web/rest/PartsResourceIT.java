package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.PartsAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Parts;
import com.mycompany.myapp.repository.PartsRepository;
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
 * Integration tests for the {@link PartsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PartsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_UPDATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/parts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PartsRepository partsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPartsMockMvc;

    private Parts parts;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Parts createEntity(EntityManager em) {
        Parts parts = new Parts()
            .name(DEFAULT_NAME)
            .status(DEFAULT_STATUS)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .updateBy(DEFAULT_UPDATE_BY);
        return parts;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Parts createUpdatedEntity(EntityManager em) {
        Parts parts = new Parts()
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);
        return parts;
    }

    @BeforeEach
    public void initTest() {
        parts = createEntity(em);
    }

    @Test
    @Transactional
    void createParts() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Parts
        var returnedParts = om.readValue(
            restPartsMockMvc
                .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(parts)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Parts.class
        );

        // Validate the Parts in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPartsUpdatableFieldsEquals(returnedParts, getPersistedParts(returnedParts));
    }

    @Test
    @Transactional
    void createPartsWithExistingId() throws Exception {
        // Create the Parts with an existing ID
        parts.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPartsMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(parts)))
            .andExpect(status().isBadRequest());

        // Validate the Parts in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllParts() throws Exception {
        // Initialize the database
        partsRepository.saveAndFlush(parts);

        // Get all the partsList
        restPartsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(parts.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)));
    }

    @Test
    @Transactional
    void getParts() throws Exception {
        // Initialize the database
        partsRepository.saveAndFlush(parts);

        // Get the parts
        restPartsMockMvc
            .perform(get(ENTITY_API_URL_ID, parts.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(parts.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY));
    }

    @Test
    @Transactional
    void getNonExistingParts() throws Exception {
        // Get the parts
        restPartsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingParts() throws Exception {
        // Initialize the database
        partsRepository.saveAndFlush(parts);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the parts
        Parts updatedParts = partsRepository.findById(parts.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedParts are not directly saved in db
        em.detach(updatedParts);
        updatedParts
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restPartsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedParts.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedParts))
            )
            .andExpect(status().isOk());

        // Validate the Parts in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPartsToMatchAllProperties(updatedParts);
    }

    @Test
    @Transactional
    void putNonExistingParts() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        parts.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPartsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, parts.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(parts))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parts in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchParts() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        parts.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(parts))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parts in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamParts() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        parts.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartsMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(parts)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Parts in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePartsWithPatch() throws Exception {
        // Initialize the database
        partsRepository.saveAndFlush(parts);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the parts using partial update
        Parts partialUpdatedParts = new Parts();
        partialUpdatedParts.setId(parts.getId());

        partialUpdatedParts.name(UPDATED_NAME).status(UPDATED_STATUS).createdAt(UPDATED_CREATED_AT).updateBy(UPDATED_UPDATE_BY);

        restPartsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParts.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedParts))
            )
            .andExpect(status().isOk());

        // Validate the Parts in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPartsUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedParts, parts), getPersistedParts(parts));
    }

    @Test
    @Transactional
    void fullUpdatePartsWithPatch() throws Exception {
        // Initialize the database
        partsRepository.saveAndFlush(parts);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the parts using partial update
        Parts partialUpdatedParts = new Parts();
        partialUpdatedParts.setId(parts.getId());

        partialUpdatedParts
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restPartsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParts.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedParts))
            )
            .andExpect(status().isOk());

        // Validate the Parts in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPartsUpdatableFieldsEquals(partialUpdatedParts, getPersistedParts(partialUpdatedParts));
    }

    @Test
    @Transactional
    void patchNonExistingParts() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        parts.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPartsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, parts.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(parts))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parts in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchParts() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        parts.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(parts))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parts in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamParts() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        parts.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartsMockMvc
            .perform(patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(parts)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Parts in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteParts() throws Exception {
        // Initialize the database
        partsRepository.saveAndFlush(parts);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the parts
        restPartsMockMvc
            .perform(delete(ENTITY_API_URL_ID, parts.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return partsRepository.count();
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

    protected Parts getPersistedParts(Parts parts) {
        return partsRepository.findById(parts.getId()).orElseThrow();
    }

    protected void assertPersistedPartsToMatchAllProperties(Parts expectedParts) {
        assertPartsAllPropertiesEquals(expectedParts, getPersistedParts(expectedParts));
    }

    protected void assertPersistedPartsToMatchUpdatableProperties(Parts expectedParts) {
        assertPartsAllUpdatablePropertiesEquals(expectedParts, getPersistedParts(expectedParts));
    }
}
