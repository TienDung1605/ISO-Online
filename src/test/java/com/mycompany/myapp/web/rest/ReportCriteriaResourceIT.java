package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ReportCriteriaAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ReportCriteria;
import com.mycompany.myapp.repository.ReportCriteriaRepository;
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
 * Integration tests for the {@link ReportCriteriaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReportCriteriaResourceIT {

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

    private static final Long DEFAULT_REPORT_ID = 1L;
    private static final Long UPDATED_REPORT_ID = 2L;

    private static final String ENTITY_API_URL = "/api/report-criteria";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ReportCriteriaRepository reportCriteriaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReportCriteriaMockMvc;

    private ReportCriteria reportCriteria;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReportCriteria createEntity(EntityManager em) {
        ReportCriteria reportCriteria = new ReportCriteria()
            .criteriaName(DEFAULT_CRITERIA_NAME)
            .criteriaGroupName(DEFAULT_CRITERIA_GROUP_NAME)
            .criteriaId(DEFAULT_CRITERIA_ID)
            .criteriaGroupId(DEFAULT_CRITERIA_GROUP_ID)
            .status(DEFAULT_STATUS)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .updateBy(DEFAULT_UPDATE_BY)
            .frequency(DEFAULT_FREQUENCY)
            .reportId(DEFAULT_REPORT_ID);
        return reportCriteria;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReportCriteria createUpdatedEntity(EntityManager em) {
        ReportCriteria reportCriteria = new ReportCriteria()
            .criteriaName(UPDATED_CRITERIA_NAME)
            .criteriaGroupName(UPDATED_CRITERIA_GROUP_NAME)
            .criteriaId(UPDATED_CRITERIA_ID)
            .criteriaGroupId(UPDATED_CRITERIA_GROUP_ID)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .frequency(UPDATED_FREQUENCY)
            .reportId(UPDATED_REPORT_ID);
        return reportCriteria;
    }

    @BeforeEach
    public void initTest() {
        reportCriteria = createEntity(em);
    }

    @Test
    @Transactional
    void createReportCriteria() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ReportCriteria
        var returnedReportCriteria = om.readValue(
            restReportCriteriaMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reportCriteria))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ReportCriteria.class
        );

        // Validate the ReportCriteria in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertReportCriteriaUpdatableFieldsEquals(returnedReportCriteria, getPersistedReportCriteria(returnedReportCriteria));
    }

    @Test
    @Transactional
    void createReportCriteriaWithExistingId() throws Exception {
        // Create the ReportCriteria with an existing ID
        reportCriteria.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReportCriteriaMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reportCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReportCriteria() throws Exception {
        // Initialize the database
        reportCriteriaRepository.saveAndFlush(reportCriteria);

        // Get all the reportCriteriaList
        restReportCriteriaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reportCriteria.getId().intValue())))
            .andExpect(jsonPath("$.[*].criteriaName").value(hasItem(DEFAULT_CRITERIA_NAME)))
            .andExpect(jsonPath("$.[*].criteriaGroupName").value(hasItem(DEFAULT_CRITERIA_GROUP_NAME)))
            .andExpect(jsonPath("$.[*].criteriaId").value(hasItem(DEFAULT_CRITERIA_ID.intValue())))
            .andExpect(jsonPath("$.[*].criteriaGroupId").value(hasItem(DEFAULT_CRITERIA_GROUP_ID.intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)))
            .andExpect(jsonPath("$.[*].frequency").value(hasItem(DEFAULT_FREQUENCY)))
            .andExpect(jsonPath("$.[*].reportId").value(hasItem(DEFAULT_REPORT_ID.intValue())));
    }

    @Test
    @Transactional
    void getReportCriteria() throws Exception {
        // Initialize the database
        reportCriteriaRepository.saveAndFlush(reportCriteria);

        // Get the reportCriteria
        restReportCriteriaMockMvc
            .perform(get(ENTITY_API_URL_ID, reportCriteria.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reportCriteria.getId().intValue()))
            .andExpect(jsonPath("$.criteriaName").value(DEFAULT_CRITERIA_NAME))
            .andExpect(jsonPath("$.criteriaGroupName").value(DEFAULT_CRITERIA_GROUP_NAME))
            .andExpect(jsonPath("$.criteriaId").value(DEFAULT_CRITERIA_ID.intValue()))
            .andExpect(jsonPath("$.criteriaGroupId").value(DEFAULT_CRITERIA_GROUP_ID.intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY))
            .andExpect(jsonPath("$.frequency").value(DEFAULT_FREQUENCY))
            .andExpect(jsonPath("$.reportId").value(DEFAULT_REPORT_ID.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingReportCriteria() throws Exception {
        // Get the reportCriteria
        restReportCriteriaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReportCriteria() throws Exception {
        // Initialize the database
        reportCriteriaRepository.saveAndFlush(reportCriteria);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reportCriteria
        ReportCriteria updatedReportCriteria = reportCriteriaRepository.findById(reportCriteria.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedReportCriteria are not directly saved in db
        em.detach(updatedReportCriteria);
        updatedReportCriteria
            .criteriaName(UPDATED_CRITERIA_NAME)
            .criteriaGroupName(UPDATED_CRITERIA_GROUP_NAME)
            .criteriaId(UPDATED_CRITERIA_ID)
            .criteriaGroupId(UPDATED_CRITERIA_GROUP_ID)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .frequency(UPDATED_FREQUENCY)
            .reportId(UPDATED_REPORT_ID);

        restReportCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReportCriteria.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedReportCriteria))
            )
            .andExpect(status().isOk());

        // Validate the ReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedReportCriteriaToMatchAllProperties(updatedReportCriteria);
    }

    @Test
    @Transactional
    void putNonExistingReportCriteria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportCriteria.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReportCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reportCriteria.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reportCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReportCriteria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportCriteria.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reportCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReportCriteria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportCriteria.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportCriteriaMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reportCriteria)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReportCriteriaWithPatch() throws Exception {
        // Initialize the database
        reportCriteriaRepository.saveAndFlush(reportCriteria);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reportCriteria using partial update
        ReportCriteria partialUpdatedReportCriteria = new ReportCriteria();
        partialUpdatedReportCriteria.setId(reportCriteria.getId());

        partialUpdatedReportCriteria
            .criteriaGroupName(UPDATED_CRITERIA_GROUP_NAME)
            .criteriaGroupId(UPDATED_CRITERIA_GROUP_ID)
            .status(UPDATED_STATUS)
            .updatedAt(UPDATED_UPDATED_AT)
            .frequency(UPDATED_FREQUENCY);

        restReportCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReportCriteria.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReportCriteria))
            )
            .andExpect(status().isOk());

        // Validate the ReportCriteria in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReportCriteriaUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedReportCriteria, reportCriteria),
            getPersistedReportCriteria(reportCriteria)
        );
    }

    @Test
    @Transactional
    void fullUpdateReportCriteriaWithPatch() throws Exception {
        // Initialize the database
        reportCriteriaRepository.saveAndFlush(reportCriteria);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reportCriteria using partial update
        ReportCriteria partialUpdatedReportCriteria = new ReportCriteria();
        partialUpdatedReportCriteria.setId(reportCriteria.getId());

        partialUpdatedReportCriteria
            .criteriaName(UPDATED_CRITERIA_NAME)
            .criteriaGroupName(UPDATED_CRITERIA_GROUP_NAME)
            .criteriaId(UPDATED_CRITERIA_ID)
            .criteriaGroupId(UPDATED_CRITERIA_GROUP_ID)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .frequency(UPDATED_FREQUENCY)
            .reportId(UPDATED_REPORT_ID);

        restReportCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReportCriteria.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReportCriteria))
            )
            .andExpect(status().isOk());

        // Validate the ReportCriteria in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReportCriteriaUpdatableFieldsEquals(partialUpdatedReportCriteria, getPersistedReportCriteria(partialUpdatedReportCriteria));
    }

    @Test
    @Transactional
    void patchNonExistingReportCriteria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportCriteria.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReportCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reportCriteria.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reportCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReportCriteria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportCriteria.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reportCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReportCriteria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportCriteria.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(reportCriteria))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReportCriteria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReportCriteria() throws Exception {
        // Initialize the database
        reportCriteriaRepository.saveAndFlush(reportCriteria);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the reportCriteria
        restReportCriteriaMockMvc
            .perform(delete(ENTITY_API_URL_ID, reportCriteria.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return reportCriteriaRepository.count();
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

    protected ReportCriteria getPersistedReportCriteria(ReportCriteria reportCriteria) {
        return reportCriteriaRepository.findById(reportCriteria.getId()).orElseThrow();
    }

    protected void assertPersistedReportCriteriaToMatchAllProperties(ReportCriteria expectedReportCriteria) {
        assertReportCriteriaAllPropertiesEquals(expectedReportCriteria, getPersistedReportCriteria(expectedReportCriteria));
    }

    protected void assertPersistedReportCriteriaToMatchUpdatableProperties(ReportCriteria expectedReportCriteria) {
        assertReportCriteriaAllUpdatablePropertiesEquals(expectedReportCriteria, getPersistedReportCriteria(expectedReportCriteria));
    }
}
