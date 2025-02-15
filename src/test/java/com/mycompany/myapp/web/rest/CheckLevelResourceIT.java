package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.CheckLevelAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CheckLevel;
import com.mycompany.myapp.repository.CheckLevelRepository;
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
 * Integration tests for the {@link CheckLevelResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CheckLevelResourceIT {

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

    private static final String ENTITY_API_URL = "/api/check-levels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CheckLevelRepository checkLevelRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCheckLevelMockMvc;

    private CheckLevel checkLevel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CheckLevel createEntity(EntityManager em) {
        CheckLevel checkLevel = new CheckLevel()
            .name(DEFAULT_NAME)
            .status(DEFAULT_STATUS)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .updateBy(DEFAULT_UPDATE_BY);
        return checkLevel;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CheckLevel createUpdatedEntity(EntityManager em) {
        CheckLevel checkLevel = new CheckLevel()
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);
        return checkLevel;
    }

    @BeforeEach
    public void initTest() {
        checkLevel = createEntity(em);
    }

    @Test
    @Transactional
    void createCheckLevel() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the CheckLevel
        var returnedCheckLevel = om.readValue(
            restCheckLevelMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(checkLevel))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            CheckLevel.class
        );

        // Validate the CheckLevel in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCheckLevelUpdatableFieldsEquals(returnedCheckLevel, getPersistedCheckLevel(returnedCheckLevel));
    }

    @Test
    @Transactional
    void createCheckLevelWithExistingId() throws Exception {
        // Create the CheckLevel with an existing ID
        checkLevel.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCheckLevelMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(checkLevel)))
            .andExpect(status().isBadRequest());

        // Validate the CheckLevel in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCheckLevels() throws Exception {
        // Initialize the database
        checkLevelRepository.saveAndFlush(checkLevel);

        // Get all the checkLevelList
        restCheckLevelMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(checkLevel.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)));
    }

    @Test
    @Transactional
    void getCheckLevel() throws Exception {
        // Initialize the database
        checkLevelRepository.saveAndFlush(checkLevel);

        // Get the checkLevel
        restCheckLevelMockMvc
            .perform(get(ENTITY_API_URL_ID, checkLevel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(checkLevel.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY));
    }

    @Test
    @Transactional
    void getNonExistingCheckLevel() throws Exception {
        // Get the checkLevel
        restCheckLevelMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCheckLevel() throws Exception {
        // Initialize the database
        checkLevelRepository.saveAndFlush(checkLevel);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the checkLevel
        CheckLevel updatedCheckLevel = checkLevelRepository.findById(checkLevel.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCheckLevel are not directly saved in db
        em.detach(updatedCheckLevel);
        updatedCheckLevel
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restCheckLevelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCheckLevel.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCheckLevel))
            )
            .andExpect(status().isOk());

        // Validate the CheckLevel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCheckLevelToMatchAllProperties(updatedCheckLevel);
    }

    @Test
    @Transactional
    void putNonExistingCheckLevel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkLevel.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCheckLevelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, checkLevel.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(checkLevel))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckLevel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCheckLevel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkLevel.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckLevelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(checkLevel))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckLevel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCheckLevel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkLevel.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckLevelMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(checkLevel)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CheckLevel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCheckLevelWithPatch() throws Exception {
        // Initialize the database
        checkLevelRepository.saveAndFlush(checkLevel);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the checkLevel using partial update
        CheckLevel partialUpdatedCheckLevel = new CheckLevel();
        partialUpdatedCheckLevel.setId(checkLevel.getId());

        partialUpdatedCheckLevel.status(UPDATED_STATUS).updatedAt(UPDATED_UPDATED_AT);

        restCheckLevelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCheckLevel.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCheckLevel))
            )
            .andExpect(status().isOk());

        // Validate the CheckLevel in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCheckLevelUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedCheckLevel, checkLevel),
            getPersistedCheckLevel(checkLevel)
        );
    }

    @Test
    @Transactional
    void fullUpdateCheckLevelWithPatch() throws Exception {
        // Initialize the database
        checkLevelRepository.saveAndFlush(checkLevel);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the checkLevel using partial update
        CheckLevel partialUpdatedCheckLevel = new CheckLevel();
        partialUpdatedCheckLevel.setId(checkLevel.getId());

        partialUpdatedCheckLevel
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restCheckLevelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCheckLevel.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCheckLevel))
            )
            .andExpect(status().isOk());

        // Validate the CheckLevel in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCheckLevelUpdatableFieldsEquals(partialUpdatedCheckLevel, getPersistedCheckLevel(partialUpdatedCheckLevel));
    }

    @Test
    @Transactional
    void patchNonExistingCheckLevel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkLevel.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCheckLevelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, checkLevel.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(checkLevel))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckLevel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCheckLevel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkLevel.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckLevelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(checkLevel))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckLevel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCheckLevel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkLevel.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckLevelMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(checkLevel))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CheckLevel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCheckLevel() throws Exception {
        // Initialize the database
        checkLevelRepository.saveAndFlush(checkLevel);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the checkLevel
        restCheckLevelMockMvc
            .perform(delete(ENTITY_API_URL_ID, checkLevel.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return checkLevelRepository.count();
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

    protected CheckLevel getPersistedCheckLevel(CheckLevel checkLevel) {
        return checkLevelRepository.findById(checkLevel.getId()).orElseThrow();
    }

    protected void assertPersistedCheckLevelToMatchAllProperties(CheckLevel expectedCheckLevel) {
        assertCheckLevelAllPropertiesEquals(expectedCheckLevel, getPersistedCheckLevel(expectedCheckLevel));
    }

    protected void assertPersistedCheckLevelToMatchUpdatableProperties(CheckLevel expectedCheckLevel) {
        assertCheckLevelAllUpdatablePropertiesEquals(expectedCheckLevel, getPersistedCheckLevel(expectedCheckLevel));
    }
}
