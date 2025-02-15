package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.CheckTargetAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CheckTarget;
import com.mycompany.myapp.repository.CheckTargetRepository;
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
 * Integration tests for the {@link CheckTargetResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CheckTargetResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_INSPECTION_TARGET = "AAAAAAAAAA";
    private static final String UPDATED_INSPECTION_TARGET = "BBBBBBBBBB";

    private static final Long DEFAULT_EVALUATION_LEVEL_ID = 1L;
    private static final Long UPDATED_EVALUATION_LEVEL_ID = 2L;

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_UPDATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/check-targets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CheckTargetRepository checkTargetRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCheckTargetMockMvc;

    private CheckTarget checkTarget;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CheckTarget createEntity(EntityManager em) {
        CheckTarget checkTarget = new CheckTarget()
            .name(DEFAULT_NAME)
            .inspectionTarget(DEFAULT_INSPECTION_TARGET)
            .evaluationLevelId(DEFAULT_EVALUATION_LEVEL_ID)
            .status(DEFAULT_STATUS)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .updateBy(DEFAULT_UPDATE_BY);
        return checkTarget;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CheckTarget createUpdatedEntity(EntityManager em) {
        CheckTarget checkTarget = new CheckTarget()
            .name(UPDATED_NAME)
            .inspectionTarget(UPDATED_INSPECTION_TARGET)
            .evaluationLevelId(UPDATED_EVALUATION_LEVEL_ID)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);
        return checkTarget;
    }

    @BeforeEach
    public void initTest() {
        checkTarget = createEntity(em);
    }

    @Test
    @Transactional
    void createCheckTarget() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the CheckTarget
        var returnedCheckTarget = om.readValue(
            restCheckTargetMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(checkTarget))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            CheckTarget.class
        );

        // Validate the CheckTarget in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCheckTargetUpdatableFieldsEquals(returnedCheckTarget, getPersistedCheckTarget(returnedCheckTarget));
    }

    @Test
    @Transactional
    void createCheckTargetWithExistingId() throws Exception {
        // Create the CheckTarget with an existing ID
        checkTarget.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCheckTargetMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(checkTarget)))
            .andExpect(status().isBadRequest());

        // Validate the CheckTarget in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCheckTargets() throws Exception {
        // Initialize the database
        checkTargetRepository.saveAndFlush(checkTarget);

        // Get all the checkTargetList
        restCheckTargetMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(checkTarget.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].inspectionTarget").value(hasItem(DEFAULT_INSPECTION_TARGET)))
            .andExpect(jsonPath("$.[*].evaluationLevelId").value(hasItem(DEFAULT_EVALUATION_LEVEL_ID.intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)));
    }

    @Test
    @Transactional
    void getCheckTarget() throws Exception {
        // Initialize the database
        checkTargetRepository.saveAndFlush(checkTarget);

        // Get the checkTarget
        restCheckTargetMockMvc
            .perform(get(ENTITY_API_URL_ID, checkTarget.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(checkTarget.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.inspectionTarget").value(DEFAULT_INSPECTION_TARGET))
            .andExpect(jsonPath("$.evaluationLevelId").value(DEFAULT_EVALUATION_LEVEL_ID.intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY));
    }

    @Test
    @Transactional
    void getNonExistingCheckTarget() throws Exception {
        // Get the checkTarget
        restCheckTargetMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCheckTarget() throws Exception {
        // Initialize the database
        checkTargetRepository.saveAndFlush(checkTarget);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the checkTarget
        CheckTarget updatedCheckTarget = checkTargetRepository.findById(checkTarget.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCheckTarget are not directly saved in db
        em.detach(updatedCheckTarget);
        updatedCheckTarget
            .name(UPDATED_NAME)
            .inspectionTarget(UPDATED_INSPECTION_TARGET)
            .evaluationLevelId(UPDATED_EVALUATION_LEVEL_ID)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restCheckTargetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCheckTarget.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCheckTarget))
            )
            .andExpect(status().isOk());

        // Validate the CheckTarget in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCheckTargetToMatchAllProperties(updatedCheckTarget);
    }

    @Test
    @Transactional
    void putNonExistingCheckTarget() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkTarget.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCheckTargetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, checkTarget.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(checkTarget))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckTarget in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCheckTarget() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkTarget.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckTargetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(checkTarget))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckTarget in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCheckTarget() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkTarget.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckTargetMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(checkTarget)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CheckTarget in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCheckTargetWithPatch() throws Exception {
        // Initialize the database
        checkTargetRepository.saveAndFlush(checkTarget);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the checkTarget using partial update
        CheckTarget partialUpdatedCheckTarget = new CheckTarget();
        partialUpdatedCheckTarget.setId(checkTarget.getId());

        partialUpdatedCheckTarget
            .evaluationLevelId(UPDATED_EVALUATION_LEVEL_ID)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restCheckTargetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCheckTarget.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCheckTarget))
            )
            .andExpect(status().isOk());

        // Validate the CheckTarget in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCheckTargetUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedCheckTarget, checkTarget),
            getPersistedCheckTarget(checkTarget)
        );
    }

    @Test
    @Transactional
    void fullUpdateCheckTargetWithPatch() throws Exception {
        // Initialize the database
        checkTargetRepository.saveAndFlush(checkTarget);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the checkTarget using partial update
        CheckTarget partialUpdatedCheckTarget = new CheckTarget();
        partialUpdatedCheckTarget.setId(checkTarget.getId());

        partialUpdatedCheckTarget
            .name(UPDATED_NAME)
            .inspectionTarget(UPDATED_INSPECTION_TARGET)
            .evaluationLevelId(UPDATED_EVALUATION_LEVEL_ID)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restCheckTargetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCheckTarget.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCheckTarget))
            )
            .andExpect(status().isOk());

        // Validate the CheckTarget in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCheckTargetUpdatableFieldsEquals(partialUpdatedCheckTarget, getPersistedCheckTarget(partialUpdatedCheckTarget));
    }

    @Test
    @Transactional
    void patchNonExistingCheckTarget() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkTarget.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCheckTargetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, checkTarget.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(checkTarget))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckTarget in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCheckTarget() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkTarget.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckTargetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(checkTarget))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckTarget in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCheckTarget() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkTarget.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckTargetMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(checkTarget))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CheckTarget in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCheckTarget() throws Exception {
        // Initialize the database
        checkTargetRepository.saveAndFlush(checkTarget);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the checkTarget
        restCheckTargetMockMvc
            .perform(delete(ENTITY_API_URL_ID, checkTarget.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return checkTargetRepository.count();
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

    protected CheckTarget getPersistedCheckTarget(CheckTarget checkTarget) {
        return checkTargetRepository.findById(checkTarget.getId()).orElseThrow();
    }

    protected void assertPersistedCheckTargetToMatchAllProperties(CheckTarget expectedCheckTarget) {
        assertCheckTargetAllPropertiesEquals(expectedCheckTarget, getPersistedCheckTarget(expectedCheckTarget));
    }

    protected void assertPersistedCheckTargetToMatchUpdatableProperties(CheckTarget expectedCheckTarget) {
        assertCheckTargetAllUpdatablePropertiesEquals(expectedCheckTarget, getPersistedCheckTarget(expectedCheckTarget));
    }
}
