package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ReportAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Report;
import com.mycompany.myapp.repository.ReportRepository;
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
 * Integration tests for the {@link ReportResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReportResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final Long DEFAULT_SAMPLE_REPORT_ID = 1L;
    private static final Long UPDATED_SAMPLE_REPORT_ID = 2L;

    private static final String DEFAULT_TEST_OF_OBJECT = "AAAAAAAAAA";
    private static final String UPDATED_TEST_OF_OBJECT = "BBBBBBBBBB";

    private static final String DEFAULT_CHECKER = "AAAAAAAAAA";
    private static final String UPDATED_CHECKER = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_FREQUENCY = "AAAAAAAAAA";
    private static final String UPDATED_FREQUENCY = "BBBBBBBBBB";

    private static final String DEFAULT_REPORT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_REPORT_TYPE = "BBBBBBBBBB";

    private static final Long DEFAULT_REPORT_TYPE_ID = 1L;
    private static final Long UPDATED_REPORT_TYPE_ID = 2L;

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_SCORE_SCALE = "AAAAAAAAAA";
    private static final String UPDATED_SCORE_SCALE = "BBBBBBBBBB";

    private static final String DEFAULT_UPDATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_BY = "BBBBBBBBBB";

    private static final String DEFAULT_PLAN_ID = "AAAAAAAAAA";
    private static final String UPDATED_PLAN_ID = "BBBBBBBBBB";

    private static final String DEFAULT_USER = "AAAAAAAAAA";
    private static final String UPDATED_USER = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/reports";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReportMockMvc;

    private Report report;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Report createEntity(EntityManager em) {
        Report report = new Report()
            .name(DEFAULT_NAME)
            .code(DEFAULT_CODE)
            .sampleReportId(DEFAULT_SAMPLE_REPORT_ID)
            .testOfObject(DEFAULT_TEST_OF_OBJECT)
            .checker(DEFAULT_CHECKER)
            .status(DEFAULT_STATUS)
            .frequency(DEFAULT_FREQUENCY)
            .reportType(DEFAULT_REPORT_TYPE)
            .reportTypeId(DEFAULT_REPORT_TYPE_ID)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .scoreScale(DEFAULT_SCORE_SCALE)
            .updateBy(DEFAULT_UPDATE_BY)
            .planId(DEFAULT_PLAN_ID)
            .user(DEFAULT_USER);
        return report;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Report createUpdatedEntity(EntityManager em) {
        Report report = new Report()
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .sampleReportId(UPDATED_SAMPLE_REPORT_ID)
            .testOfObject(UPDATED_TEST_OF_OBJECT)
            .checker(UPDATED_CHECKER)
            .status(UPDATED_STATUS)
            .frequency(UPDATED_FREQUENCY)
            .reportType(UPDATED_REPORT_TYPE)
            .reportTypeId(UPDATED_REPORT_TYPE_ID)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .scoreScale(UPDATED_SCORE_SCALE)
            .updateBy(UPDATED_UPDATE_BY)
            .planId(UPDATED_PLAN_ID)
            .user(UPDATED_USER);
        return report;
    }

    @BeforeEach
    public void initTest() {
        report = createEntity(em);
    }

    @Test
    @Transactional
    void createReport() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Report
        var returnedReport = om.readValue(
            restReportMockMvc
                .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(report)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Report.class
        );

        // Validate the Report in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertReportUpdatableFieldsEquals(returnedReport, getPersistedReport(returnedReport));
    }

    @Test
    @Transactional
    void createReportWithExistingId() throws Exception {
        // Create the Report with an existing ID
        report.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReportMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(report)))
            .andExpect(status().isBadRequest());

        // Validate the Report in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReports() throws Exception {
        // Initialize the database
        reportRepository.saveAndFlush(report);

        // Get all the reportList
        restReportMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(report.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].sampleReportId").value(hasItem(DEFAULT_SAMPLE_REPORT_ID.intValue())))
            .andExpect(jsonPath("$.[*].testOfObject").value(hasItem(DEFAULT_TEST_OF_OBJECT)))
            .andExpect(jsonPath("$.[*].checker").value(hasItem(DEFAULT_CHECKER)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].frequency").value(hasItem(DEFAULT_FREQUENCY)))
            .andExpect(jsonPath("$.[*].reportType").value(hasItem(DEFAULT_REPORT_TYPE)))
            .andExpect(jsonPath("$.[*].reportTypeId").value(hasItem(DEFAULT_REPORT_TYPE_ID.intValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].scoreScale").value(hasItem(DEFAULT_SCORE_SCALE)))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)))
            .andExpect(jsonPath("$.[*].planId").value(hasItem(DEFAULT_PLAN_ID)))
            .andExpect(jsonPath("$.[*].user").value(hasItem(DEFAULT_USER)));
    }

    @Test
    @Transactional
    void getReport() throws Exception {
        // Initialize the database
        reportRepository.saveAndFlush(report);

        // Get the report
        restReportMockMvc
            .perform(get(ENTITY_API_URL_ID, report.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(report.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.sampleReportId").value(DEFAULT_SAMPLE_REPORT_ID.intValue()))
            .andExpect(jsonPath("$.testOfObject").value(DEFAULT_TEST_OF_OBJECT))
            .andExpect(jsonPath("$.checker").value(DEFAULT_CHECKER))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.frequency").value(DEFAULT_FREQUENCY))
            .andExpect(jsonPath("$.reportType").value(DEFAULT_REPORT_TYPE))
            .andExpect(jsonPath("$.reportTypeId").value(DEFAULT_REPORT_TYPE_ID.intValue()))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.scoreScale").value(DEFAULT_SCORE_SCALE))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY))
            .andExpect(jsonPath("$.planId").value(DEFAULT_PLAN_ID))
            .andExpect(jsonPath("$.user").value(DEFAULT_USER));
    }

    @Test
    @Transactional
    void getNonExistingReport() throws Exception {
        // Get the report
        restReportMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReport() throws Exception {
        // Initialize the database
        reportRepository.saveAndFlush(report);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the report
        Report updatedReport = reportRepository.findById(report.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedReport are not directly saved in db
        em.detach(updatedReport);
        updatedReport
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .sampleReportId(UPDATED_SAMPLE_REPORT_ID)
            .testOfObject(UPDATED_TEST_OF_OBJECT)
            .checker(UPDATED_CHECKER)
            .status(UPDATED_STATUS)
            .frequency(UPDATED_FREQUENCY)
            .reportType(UPDATED_REPORT_TYPE)
            .reportTypeId(UPDATED_REPORT_TYPE_ID)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .scoreScale(UPDATED_SCORE_SCALE)
            .updateBy(UPDATED_UPDATE_BY)
            .planId(UPDATED_PLAN_ID)
            .user(UPDATED_USER);

        restReportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReport.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedReport))
            )
            .andExpect(status().isOk());

        // Validate the Report in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedReportToMatchAllProperties(updatedReport);
    }

    @Test
    @Transactional
    void putNonExistingReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        report.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, report.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(report))
            )
            .andExpect(status().isBadRequest());

        // Validate the Report in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        report.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(report))
            )
            .andExpect(status().isBadRequest());

        // Validate the Report in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        report.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(report)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Report in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReportWithPatch() throws Exception {
        // Initialize the database
        reportRepository.saveAndFlush(report);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the report using partial update
        Report partialUpdatedReport = new Report();
        partialUpdatedReport.setId(report.getId());

        partialUpdatedReport
            .code(UPDATED_CODE)
            .sampleReportId(UPDATED_SAMPLE_REPORT_ID)
            .testOfObject(UPDATED_TEST_OF_OBJECT)
            .status(UPDATED_STATUS)
            .frequency(UPDATED_FREQUENCY)
            .reportTypeId(UPDATED_REPORT_TYPE_ID)
            .updatedAt(UPDATED_UPDATED_AT)
            .scoreScale(UPDATED_SCORE_SCALE);

        restReportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReport.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReport))
            )
            .andExpect(status().isOk());

        // Validate the Report in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReportUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedReport, report), getPersistedReport(report));
    }

    @Test
    @Transactional
    void fullUpdateReportWithPatch() throws Exception {
        // Initialize the database
        reportRepository.saveAndFlush(report);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the report using partial update
        Report partialUpdatedReport = new Report();
        partialUpdatedReport.setId(report.getId());

        partialUpdatedReport
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .sampleReportId(UPDATED_SAMPLE_REPORT_ID)
            .testOfObject(UPDATED_TEST_OF_OBJECT)
            .checker(UPDATED_CHECKER)
            .status(UPDATED_STATUS)
            .frequency(UPDATED_FREQUENCY)
            .reportType(UPDATED_REPORT_TYPE)
            .reportTypeId(UPDATED_REPORT_TYPE_ID)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .scoreScale(UPDATED_SCORE_SCALE)
            .updateBy(UPDATED_UPDATE_BY)
            .planId(UPDATED_PLAN_ID)
            .user(UPDATED_USER);

        restReportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReport.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReport))
            )
            .andExpect(status().isOk());

        // Validate the Report in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReportUpdatableFieldsEquals(partialUpdatedReport, getPersistedReport(partialUpdatedReport));
    }

    @Test
    @Transactional
    void patchNonExistingReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        report.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, report.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(report))
            )
            .andExpect(status().isBadRequest());

        // Validate the Report in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        report.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(report))
            )
            .andExpect(status().isBadRequest());

        // Validate the Report in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        report.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportMockMvc
            .perform(patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(report)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Report in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReport() throws Exception {
        // Initialize the database
        reportRepository.saveAndFlush(report);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the report
        restReportMockMvc
            .perform(delete(ENTITY_API_URL_ID, report.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return reportRepository.count();
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

    protected Report getPersistedReport(Report report) {
        return reportRepository.findById(report.getId()).orElseThrow();
    }

    protected void assertPersistedReportToMatchAllProperties(Report expectedReport) {
        assertReportAllPropertiesEquals(expectedReport, getPersistedReport(expectedReport));
    }

    protected void assertPersistedReportToMatchUpdatableProperties(Report expectedReport) {
        assertReportAllUpdatablePropertiesEquals(expectedReport, getPersistedReport(expectedReport));
    }
}
