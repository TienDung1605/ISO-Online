package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.EvaluatorAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Evaluator;
import com.mycompany.myapp.repository.EvaluatorRepository;
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
 * Integration tests for the {@link EvaluatorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EvaluatorResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Long DEFAULT_USER_GROUP_ID = 1L;
    private static final Long UPDATED_USER_GROUP_ID = 2L;

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_UPDATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/evaluators";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EvaluatorRepository evaluatorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEvaluatorMockMvc;

    private Evaluator evaluator;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Evaluator createEntity(EntityManager em) {
        Evaluator evaluator = new Evaluator()
            .name(DEFAULT_NAME)
            .userGroupId(DEFAULT_USER_GROUP_ID)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .status(DEFAULT_STATUS)
            .updateBy(DEFAULT_UPDATE_BY);
        return evaluator;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Evaluator createUpdatedEntity(EntityManager em) {
        Evaluator evaluator = new Evaluator()
            .name(UPDATED_NAME)
            .userGroupId(UPDATED_USER_GROUP_ID)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .status(UPDATED_STATUS)
            .updateBy(UPDATED_UPDATE_BY);
        return evaluator;
    }

    @BeforeEach
    public void initTest() {
        evaluator = createEntity(em);
    }

    @Test
    @Transactional
    void createEvaluator() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Evaluator
        var returnedEvaluator = om.readValue(
            restEvaluatorMockMvc
                .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(evaluator)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Evaluator.class
        );

        // Validate the Evaluator in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEvaluatorUpdatableFieldsEquals(returnedEvaluator, getPersistedEvaluator(returnedEvaluator));
    }

    @Test
    @Transactional
    void createEvaluatorWithExistingId() throws Exception {
        // Create the Evaluator with an existing ID
        evaluator.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEvaluatorMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(evaluator)))
            .andExpect(status().isBadRequest());

        // Validate the Evaluator in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEvaluators() throws Exception {
        // Initialize the database
        evaluatorRepository.saveAndFlush(evaluator);

        // Get all the evaluatorList
        restEvaluatorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(evaluator.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].userGroupId").value(hasItem(DEFAULT_USER_GROUP_ID.intValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)));
    }

    @Test
    @Transactional
    void getEvaluator() throws Exception {
        // Initialize the database
        evaluatorRepository.saveAndFlush(evaluator);

        // Get the evaluator
        restEvaluatorMockMvc
            .perform(get(ENTITY_API_URL_ID, evaluator.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(evaluator.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.userGroupId").value(DEFAULT_USER_GROUP_ID.intValue()))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY));
    }

    @Test
    @Transactional
    void getNonExistingEvaluator() throws Exception {
        // Get the evaluator
        restEvaluatorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEvaluator() throws Exception {
        // Initialize the database
        evaluatorRepository.saveAndFlush(evaluator);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the evaluator
        Evaluator updatedEvaluator = evaluatorRepository.findById(evaluator.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEvaluator are not directly saved in db
        em.detach(updatedEvaluator);
        updatedEvaluator
            .name(UPDATED_NAME)
            .userGroupId(UPDATED_USER_GROUP_ID)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .status(UPDATED_STATUS)
            .updateBy(UPDATED_UPDATE_BY);

        restEvaluatorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEvaluator.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedEvaluator))
            )
            .andExpect(status().isOk());

        // Validate the Evaluator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEvaluatorToMatchAllProperties(updatedEvaluator);
    }

    @Test
    @Transactional
    void putNonExistingEvaluator() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        evaluator.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEvaluatorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, evaluator.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(evaluator))
            )
            .andExpect(status().isBadRequest());

        // Validate the Evaluator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEvaluator() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        evaluator.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEvaluatorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(evaluator))
            )
            .andExpect(status().isBadRequest());

        // Validate the Evaluator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEvaluator() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        evaluator.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEvaluatorMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(evaluator)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Evaluator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEvaluatorWithPatch() throws Exception {
        // Initialize the database
        evaluatorRepository.saveAndFlush(evaluator);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the evaluator using partial update
        Evaluator partialUpdatedEvaluator = new Evaluator();
        partialUpdatedEvaluator.setId(evaluator.getId());

        partialUpdatedEvaluator.name(UPDATED_NAME).userGroupId(UPDATED_USER_GROUP_ID).updateBy(UPDATED_UPDATE_BY);

        restEvaluatorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEvaluator.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEvaluator))
            )
            .andExpect(status().isOk());

        // Validate the Evaluator in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEvaluatorUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedEvaluator, evaluator),
            getPersistedEvaluator(evaluator)
        );
    }

    @Test
    @Transactional
    void fullUpdateEvaluatorWithPatch() throws Exception {
        // Initialize the database
        evaluatorRepository.saveAndFlush(evaluator);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the evaluator using partial update
        Evaluator partialUpdatedEvaluator = new Evaluator();
        partialUpdatedEvaluator.setId(evaluator.getId());

        partialUpdatedEvaluator
            .name(UPDATED_NAME)
            .userGroupId(UPDATED_USER_GROUP_ID)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .status(UPDATED_STATUS)
            .updateBy(UPDATED_UPDATE_BY);

        restEvaluatorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEvaluator.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEvaluator))
            )
            .andExpect(status().isOk());

        // Validate the Evaluator in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEvaluatorUpdatableFieldsEquals(partialUpdatedEvaluator, getPersistedEvaluator(partialUpdatedEvaluator));
    }

    @Test
    @Transactional
    void patchNonExistingEvaluator() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        evaluator.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEvaluatorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, evaluator.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(evaluator))
            )
            .andExpect(status().isBadRequest());

        // Validate the Evaluator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEvaluator() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        evaluator.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEvaluatorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(evaluator))
            )
            .andExpect(status().isBadRequest());

        // Validate the Evaluator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEvaluator() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        evaluator.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEvaluatorMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(evaluator))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Evaluator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEvaluator() throws Exception {
        // Initialize the database
        evaluatorRepository.saveAndFlush(evaluator);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the evaluator
        restEvaluatorMockMvc
            .perform(delete(ENTITY_API_URL_ID, evaluator.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return evaluatorRepository.count();
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

    protected Evaluator getPersistedEvaluator(Evaluator evaluator) {
        return evaluatorRepository.findById(evaluator.getId()).orElseThrow();
    }

    protected void assertPersistedEvaluatorToMatchAllProperties(Evaluator expectedEvaluator) {
        assertEvaluatorAllPropertiesEquals(expectedEvaluator, getPersistedEvaluator(expectedEvaluator));
    }

    protected void assertPersistedEvaluatorToMatchUpdatableProperties(Evaluator expectedEvaluator) {
        assertEvaluatorAllUpdatablePropertiesEquals(expectedEvaluator, getPersistedEvaluator(expectedEvaluator));
    }
}
