package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.SampleReportAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.SampleReport;
import com.mycompany.myapp.repository.SampleReportRepository;
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
 * Integration tests for the {@link SampleReportResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SampleReportResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Long DEFAULT_STATUS = 1L;
    private static final Long UPDATED_STATUS = 2L;

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_UPDATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_BY = "BBBBBBBBBB";

    private static final String DEFAULT_FREQUENCY = "AAAAAAAAAA";
    private static final String UPDATED_FREQUENCY = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_REPORT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_REPORT_TYPE = "BBBBBBBBBB";

    private static final Long DEFAULT_REPORT_TYPE_ID = 1L;
    private static final Long UPDATED_REPORT_TYPE_ID = 2L;

    private static final String ENTITY_API_URL = "/api/sample-reports";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SampleReportRepository sampleReportRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSampleReportMockMvc;

    private SampleReport sampleReport;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SampleReport createEntity(EntityManager em) {
        SampleReport sampleReport = new SampleReport()
            .name(DEFAULT_NAME)
            .status(DEFAULT_STATUS)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .updateBy(DEFAULT_UPDATE_BY)
            .frequency(DEFAULT_FREQUENCY)
            .code(DEFAULT_CODE)
            .reportType(DEFAULT_REPORT_TYPE)
            .reportTypeId(DEFAULT_REPORT_TYPE_ID);
        return sampleReport;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SampleReport createUpdatedEntity(EntityManager em) {
        SampleReport sampleReport = new SampleReport()
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .frequency(UPDATED_FREQUENCY)
            .code(UPDATED_CODE)
            .reportType(UPDATED_REPORT_TYPE)
            .reportTypeId(UPDATED_REPORT_TYPE_ID);
        return sampleReport;
    }

    @BeforeEach
    public void initTest() {
        sampleReport = createEntity(em);
    }

    @Test
    @Transactional
    void createSampleReport() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the SampleReport
        var returnedSampleReport = om.readValue(
            restSampleReportMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(sampleReport))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            SampleReport.class
        );

        // Validate the SampleReport in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertSampleReportUpdatableFieldsEquals(returnedSampleReport, getPersistedSampleReport(returnedSampleReport));
    }

    @Test
    @Transactional
    void createSampleReportWithExistingId() throws Exception {
        // Create the SampleReport with an existing ID
        sampleReport.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSampleReportMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(sampleReport)))
            .andExpect(status().isBadRequest());

        // Validate the SampleReport in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSampleReports() throws Exception {
        // Initialize the database
        sampleReportRepository.saveAndFlush(sampleReport);

        // Get all the sampleReportList
        restSampleReportMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sampleReport.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.intValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)))
            .andExpect(jsonPath("$.[*].frequency").value(hasItem(DEFAULT_FREQUENCY)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].reportType").value(hasItem(DEFAULT_REPORT_TYPE)))
            .andExpect(jsonPath("$.[*].reportTypeId").value(hasItem(DEFAULT_REPORT_TYPE_ID.intValue())));
    }

    @Test
    @Transactional
    void getSampleReport() throws Exception {
        // Initialize the database
        sampleReportRepository.saveAndFlush(sampleReport);

        // Get the sampleReport
        restSampleReportMockMvc
            .perform(get(ENTITY_API_URL_ID, sampleReport.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sampleReport.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.intValue()))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY))
            .andExpect(jsonPath("$.frequency").value(DEFAULT_FREQUENCY))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.reportType").value(DEFAULT_REPORT_TYPE))
            .andExpect(jsonPath("$.reportTypeId").value(DEFAULT_REPORT_TYPE_ID.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingSampleReport() throws Exception {
        // Get the sampleReport
        restSampleReportMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSampleReport() throws Exception {
        // Initialize the database
        sampleReportRepository.saveAndFlush(sampleReport);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the sampleReport
        SampleReport updatedSampleReport = sampleReportRepository.findById(sampleReport.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSampleReport are not directly saved in db
        em.detach(updatedSampleReport);
        updatedSampleReport
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .frequency(UPDATED_FREQUENCY)
            .code(UPDATED_CODE)
            .reportType(UPDATED_REPORT_TYPE)
            .reportTypeId(UPDATED_REPORT_TYPE_ID);

        restSampleReportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSampleReport.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedSampleReport))
            )
            .andExpect(status().isOk());

        // Validate the SampleReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSampleReportToMatchAllProperties(updatedSampleReport);
    }

    @Test
    @Transactional
    void putNonExistingSampleReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sampleReport.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSampleReportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sampleReport.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(sampleReport))
            )
            .andExpect(status().isBadRequest());

        // Validate the SampleReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSampleReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sampleReport.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSampleReportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(sampleReport))
            )
            .andExpect(status().isBadRequest());

        // Validate the SampleReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSampleReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sampleReport.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSampleReportMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(sampleReport)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SampleReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSampleReportWithPatch() throws Exception {
        // Initialize the database
        sampleReportRepository.saveAndFlush(sampleReport);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the sampleReport using partial update
        SampleReport partialUpdatedSampleReport = new SampleReport();
        partialUpdatedSampleReport.setId(sampleReport.getId());

        partialUpdatedSampleReport
            .name(UPDATED_NAME)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .code(UPDATED_CODE)
            .reportType(UPDATED_REPORT_TYPE);

        restSampleReportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSampleReport.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSampleReport))
            )
            .andExpect(status().isOk());

        // Validate the SampleReport in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSampleReportUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedSampleReport, sampleReport),
            getPersistedSampleReport(sampleReport)
        );
    }

    @Test
    @Transactional
    void fullUpdateSampleReportWithPatch() throws Exception {
        // Initialize the database
        sampleReportRepository.saveAndFlush(sampleReport);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the sampleReport using partial update
        SampleReport partialUpdatedSampleReport = new SampleReport();
        partialUpdatedSampleReport.setId(sampleReport.getId());

        partialUpdatedSampleReport
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .frequency(UPDATED_FREQUENCY)
            .code(UPDATED_CODE)
            .reportType(UPDATED_REPORT_TYPE)
            .reportTypeId(UPDATED_REPORT_TYPE_ID);

        restSampleReportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSampleReport.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSampleReport))
            )
            .andExpect(status().isOk());

        // Validate the SampleReport in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSampleReportUpdatableFieldsEquals(partialUpdatedSampleReport, getPersistedSampleReport(partialUpdatedSampleReport));
    }

    @Test
    @Transactional
    void patchNonExistingSampleReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sampleReport.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSampleReportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sampleReport.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(sampleReport))
            )
            .andExpect(status().isBadRequest());

        // Validate the SampleReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSampleReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sampleReport.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSampleReportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(sampleReport))
            )
            .andExpect(status().isBadRequest());

        // Validate the SampleReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSampleReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sampleReport.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSampleReportMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(sampleReport))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SampleReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSampleReport() throws Exception {
        // Initialize the database
        sampleReportRepository.saveAndFlush(sampleReport);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the sampleReport
        restSampleReportMockMvc
            .perform(delete(ENTITY_API_URL_ID, sampleReport.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return sampleReportRepository.count();
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

    protected SampleReport getPersistedSampleReport(SampleReport sampleReport) {
        return sampleReportRepository.findById(sampleReport.getId()).orElseThrow();
    }

    protected void assertPersistedSampleReportToMatchAllProperties(SampleReport expectedSampleReport) {
        assertSampleReportAllPropertiesEquals(expectedSampleReport, getPersistedSampleReport(expectedSampleReport));
    }

    protected void assertPersistedSampleReportToMatchUpdatableProperties(SampleReport expectedSampleReport) {
        assertSampleReportAllUpdatablePropertiesEquals(expectedSampleReport, getPersistedSampleReport(expectedSampleReport));
    }
}
