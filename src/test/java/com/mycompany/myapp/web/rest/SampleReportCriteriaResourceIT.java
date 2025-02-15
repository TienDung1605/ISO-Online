package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.SampleReportCriteriaAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.SampleReportCriteria;
import com.mycompany.myapp.repository.SampleReportCriteriaRepository;
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
 * Integration tests for the {@link SampleReportCriteriaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SampleReportCriteriaResourceIT {

    private static final String DEFAULT_CRITERIA_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CRITERIA_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CRITERIA_GROUP_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CRITERIA_GROUP_NAME = "BBBBBBBBBB";

    private static final Long DEFAULT_CRITERIA_ID = 1L;
    private static final Long UPDATED_CRITERIA_ID = 2L;

    private static final Long DEFAULT_CRITERIA_GROUP_ID = 1L;
    private static final Long UPDATED_CRITERIA_GROUP_ID = 2L;

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_UPDATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_BY = "BBBBBBBBBB";

    private static final String DEFAULT_FREQUENCY = "AAAAAAAAAA";
    private static final String UPDATED_FREQUENCY = "BBBBBBBBBB";

    private static final Long DEFAULT_SAMPLE_REPORT_ID = 1L;
    private static final Long UPDATED_SAMPLE_REPORT_ID = 2L;

    private static final String DEFAULT_DETAIL = "AAAAAAAAAA";
    private static final String UPDATED_DETAIL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sample-report-criteria";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SampleReportCriteriaRepository sampleReportCriteriaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSampleReportCriteriaMockMvc;

    private SampleReportCriteria sampleReportCriteria;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SampleReportCriteria createEntity(EntityManager em) {
        SampleReportCriteria sampleReportCriteria = new SampleReportCriteria()
            .criteriaName(DEFAULT_CRITERIA_NAME)
            .criteriaGroupName(DEFAULT_CRITERIA_GROUP_NAME)
            .criteriaId(DEFAULT_CRITERIA_ID)
            .criteriaGroupId(DEFAULT_CRITERIA_GROUP_ID)
            .status(DEFAULT_STATUS)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .updateBy(DEFAULT_UPDATE_BY)
            .frequency(DEFAULT_FREQUENCY)
            .sampleReportId(DEFAULT_SAMPLE_REPORT_ID)
            .detail(DEFAULT_DETAIL);
        return sampleReportCriteria;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SampleReportCriteria createUpdatedEntity(EntityManager em) {
        SampleReportCriteria sampleReportCriteria = new SampleReportCriteria()
            .criteriaName(UPDATED_CRITERIA_NAME)
            .criteriaGroupName(UPDATED_CRITERIA_GROUP_NAME)
            .criteriaId(UPDATED_CRITERIA_ID)
            .criteriaGroupId(UPDATED_CRITERIA_GROUP_ID)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .frequency(UPDATED_FREQUENCY)
            .sampleReportId(UPDATED_SAMPLE_REPORT_ID)
            .detail(UPDATED_DETAIL);
        return sampleReportCriteria;
    }

    @BeforeEach
    public void initTest() {
        sampleReportCriteria = createEntity(em);
    }

    @Test
    @Transactional
    void createSampleReportCriteria() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the SampleReportCriteria
        var returnedSampleReportCriteria = om.readValue(
            restSampleReportCriteriaMockMvc
                .perform(
                    post(ENTITY_API_URL)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsBytes(sampleReportCriteria))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            SampleReportCriteria.class
        );

        // Validate the SampleReportCriteria in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertSampleReportCriteriaUpdatableFieldsEquals(
            returnedSampleReportCriteria,
            getPersistedSampleReportCriteria(returnedSampleReportCriteria)
        );
    }

    @Test
    @Transactional
    void createSampleReportCriteriaWithExistingId() throws Exception {
        // Create the SampleReportCriteria with an existing ID
        sampleReportCriteria.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSampleReportCriteriaMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(sampleReportCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SampleReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSampleReportCriteria() throws Exception {
        // Initialize the database
        sampleReportCriteriaRepository.saveAndFlush(sampleReportCriteria);

        // Get all the sampleReportCriteriaList
        restSampleReportCriteriaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sampleReportCriteria.getId().intValue())))
            .andExpect(jsonPath("$.[*].criteriaName").value(hasItem(DEFAULT_CRITERIA_NAME)))
            .andExpect(jsonPath("$.[*].criteriaGroupName").value(hasItem(DEFAULT_CRITERIA_GROUP_NAME)))
            .andExpect(jsonPath("$.[*].criteriaId").value(hasItem(DEFAULT_CRITERIA_ID.intValue())))
            .andExpect(jsonPath("$.[*].criteriaGroupId").value(hasItem(DEFAULT_CRITERIA_GROUP_ID.intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)))
            .andExpect(jsonPath("$.[*].frequency").value(hasItem(DEFAULT_FREQUENCY)))
            .andExpect(jsonPath("$.[*].sampleReportId").value(hasItem(DEFAULT_SAMPLE_REPORT_ID.intValue())))
            .andExpect(jsonPath("$.[*].detail").value(hasItem(DEFAULT_DETAIL)));
    }

    @Test
    @Transactional
    void getSampleReportCriteria() throws Exception {
        // Initialize the database
        sampleReportCriteriaRepository.saveAndFlush(sampleReportCriteria);

        // Get the sampleReportCriteria
        restSampleReportCriteriaMockMvc
            .perform(get(ENTITY_API_URL_ID, sampleReportCriteria.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sampleReportCriteria.getId().intValue()))
            .andExpect(jsonPath("$.criteriaName").value(DEFAULT_CRITERIA_NAME))
            .andExpect(jsonPath("$.criteriaGroupName").value(DEFAULT_CRITERIA_GROUP_NAME))
            .andExpect(jsonPath("$.criteriaId").value(DEFAULT_CRITERIA_ID.intValue()))
            .andExpect(jsonPath("$.criteriaGroupId").value(DEFAULT_CRITERIA_GROUP_ID.intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY))
            .andExpect(jsonPath("$.frequency").value(DEFAULT_FREQUENCY))
            .andExpect(jsonPath("$.sampleReportId").value(DEFAULT_SAMPLE_REPORT_ID.intValue()))
            .andExpect(jsonPath("$.detail").value(DEFAULT_DETAIL));
    }

    @Test
    @Transactional
    void getNonExistingSampleReportCriteria() throws Exception {
        // Get the sampleReportCriteria
        restSampleReportCriteriaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSampleReportCriteria() throws Exception {
        // Initialize the database
        sampleReportCriteriaRepository.saveAndFlush(sampleReportCriteria);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the sampleReportCriteria
        SampleReportCriteria updatedSampleReportCriteria = sampleReportCriteriaRepository
            .findById(sampleReportCriteria.getId())
            .orElseThrow();
        // Disconnect from session so that the updates on updatedSampleReportCriteria are not directly saved in db
        em.detach(updatedSampleReportCriteria);
        updatedSampleReportCriteria
            .criteriaName(UPDATED_CRITERIA_NAME)
            .criteriaGroupName(UPDATED_CRITERIA_GROUP_NAME)
            .criteriaId(UPDATED_CRITERIA_ID)
            .criteriaGroupId(UPDATED_CRITERIA_GROUP_ID)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .frequency(UPDATED_FREQUENCY)
            .sampleReportId(UPDATED_SAMPLE_REPORT_ID)
            .detail(UPDATED_DETAIL);

        restSampleReportCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSampleReportCriteria.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedSampleReportCriteria))
            )
            .andExpect(status().isOk());

        // Validate the SampleReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSampleReportCriteriaToMatchAllProperties(updatedSampleReportCriteria);
    }

    @Test
    @Transactional
    void putNonExistingSampleReportCriteria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sampleReportCriteria.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSampleReportCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sampleReportCriteria.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(sampleReportCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SampleReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSampleReportCriteria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sampleReportCriteria.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSampleReportCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(sampleReportCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SampleReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSampleReportCriteria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sampleReportCriteria.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSampleReportCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(sampleReportCriteria))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SampleReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSampleReportCriteriaWithPatch() throws Exception {
        // Initialize the database
        sampleReportCriteriaRepository.saveAndFlush(sampleReportCriteria);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the sampleReportCriteria using partial update
        SampleReportCriteria partialUpdatedSampleReportCriteria = new SampleReportCriteria();
        partialUpdatedSampleReportCriteria.setId(sampleReportCriteria.getId());

        partialUpdatedSampleReportCriteria
            .criteriaName(UPDATED_CRITERIA_NAME)
            .criteriaGroupName(UPDATED_CRITERIA_GROUP_NAME)
            .criteriaId(UPDATED_CRITERIA_ID)
            .criteriaGroupId(UPDATED_CRITERIA_GROUP_ID)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .sampleReportId(UPDATED_SAMPLE_REPORT_ID)
            .detail(UPDATED_DETAIL);

        restSampleReportCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSampleReportCriteria.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSampleReportCriteria))
            )
            .andExpect(status().isOk());

        // Validate the SampleReportCriteria in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSampleReportCriteriaUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedSampleReportCriteria, sampleReportCriteria),
            getPersistedSampleReportCriteria(sampleReportCriteria)
        );
    }

    @Test
    @Transactional
    void fullUpdateSampleReportCriteriaWithPatch() throws Exception {
        // Initialize the database
        sampleReportCriteriaRepository.saveAndFlush(sampleReportCriteria);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the sampleReportCriteria using partial update
        SampleReportCriteria partialUpdatedSampleReportCriteria = new SampleReportCriteria();
        partialUpdatedSampleReportCriteria.setId(sampleReportCriteria.getId());

        partialUpdatedSampleReportCriteria
            .criteriaName(UPDATED_CRITERIA_NAME)
            .criteriaGroupName(UPDATED_CRITERIA_GROUP_NAME)
            .criteriaId(UPDATED_CRITERIA_ID)
            .criteriaGroupId(UPDATED_CRITERIA_GROUP_ID)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .frequency(UPDATED_FREQUENCY)
            .sampleReportId(UPDATED_SAMPLE_REPORT_ID)
            .detail(UPDATED_DETAIL);

        restSampleReportCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSampleReportCriteria.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSampleReportCriteria))
            )
            .andExpect(status().isOk());

        // Validate the SampleReportCriteria in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSampleReportCriteriaUpdatableFieldsEquals(
            partialUpdatedSampleReportCriteria,
            getPersistedSampleReportCriteria(partialUpdatedSampleReportCriteria)
        );
    }

    @Test
    @Transactional
    void patchNonExistingSampleReportCriteria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sampleReportCriteria.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSampleReportCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sampleReportCriteria.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(sampleReportCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SampleReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSampleReportCriteria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sampleReportCriteria.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSampleReportCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(sampleReportCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SampleReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSampleReportCriteria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sampleReportCriteria.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSampleReportCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(sampleReportCriteria))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SampleReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSampleReportCriteria() throws Exception {
        // Initialize the database
        sampleReportCriteriaRepository.saveAndFlush(sampleReportCriteria);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the sampleReportCriteria
        restSampleReportCriteriaMockMvc
            .perform(delete(ENTITY_API_URL_ID, sampleReportCriteria.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return sampleReportCriteriaRepository.count();
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

    protected SampleReportCriteria getPersistedSampleReportCriteria(SampleReportCriteria sampleReportCriteria) {
        return sampleReportCriteriaRepository.findById(sampleReportCriteria.getId()).orElseThrow();
    }

    protected void assertPersistedSampleReportCriteriaToMatchAllProperties(SampleReportCriteria expectedSampleReportCriteria) {
        assertSampleReportCriteriaAllPropertiesEquals(
            expectedSampleReportCriteria,
            getPersistedSampleReportCriteria(expectedSampleReportCriteria)
        );
    }

    protected void assertPersistedSampleReportCriteriaToMatchUpdatableProperties(SampleReportCriteria expectedSampleReportCriteria) {
        assertSampleReportCriteriaAllUpdatablePropertiesEquals(
            expectedSampleReportCriteria,
            getPersistedSampleReportCriteria(expectedSampleReportCriteria)
        );
    }
}
