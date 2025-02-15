package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ReportTitleAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ReportTitle;
import com.mycompany.myapp.repository.ReportTitleRepository;
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
 * Integration tests for the {@link ReportTitleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReportTitleResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SOURCE = "AAAAAAAAAA";
    private static final String UPDATED_SOURCE = "BBBBBBBBBB";

    private static final String DEFAULT_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_FIELD = "BBBBBBBBBB";

    private static final String DEFAULT_DATA_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_DATA_TYPE = "BBBBBBBBBB";

    private static final Long DEFAULT_INDEX = 1L;
    private static final Long UPDATED_INDEX = 2L;

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_UPDATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_BY = "BBBBBBBBBB";

    private static final Long DEFAULT_REPORT_ID = 1L;
    private static final Long UPDATED_REPORT_ID = 2L;

    private static final String ENTITY_API_URL = "/api/report-titles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ReportTitleRepository reportTitleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReportTitleMockMvc;

    private ReportTitle reportTitle;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReportTitle createEntity(EntityManager em) {
        ReportTitle reportTitle = new ReportTitle()
            .name(DEFAULT_NAME)
            .source(DEFAULT_SOURCE)
            .field(DEFAULT_FIELD)
            .dataType(DEFAULT_DATA_TYPE)
            .index(DEFAULT_INDEX)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .updateBy(DEFAULT_UPDATE_BY)
            .reportId(DEFAULT_REPORT_ID);
        return reportTitle;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReportTitle createUpdatedEntity(EntityManager em) {
        ReportTitle reportTitle = new ReportTitle()
            .name(UPDATED_NAME)
            .source(UPDATED_SOURCE)
            .field(UPDATED_FIELD)
            .dataType(UPDATED_DATA_TYPE)
            .index(UPDATED_INDEX)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .reportId(UPDATED_REPORT_ID);
        return reportTitle;
    }

    @BeforeEach
    public void initTest() {
        reportTitle = createEntity(em);
    }

    @Test
    @Transactional
    void createReportTitle() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ReportTitle
        var returnedReportTitle = om.readValue(
            restReportTitleMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reportTitle))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ReportTitle.class
        );

        // Validate the ReportTitle in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertReportTitleUpdatableFieldsEquals(returnedReportTitle, getPersistedReportTitle(returnedReportTitle));
    }

    @Test
    @Transactional
    void createReportTitleWithExistingId() throws Exception {
        // Create the ReportTitle with an existing ID
        reportTitle.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReportTitleMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reportTitle)))
            .andExpect(status().isBadRequest());

        // Validate the ReportTitle in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReportTitles() throws Exception {
        // Initialize the database
        reportTitleRepository.saveAndFlush(reportTitle);

        // Get all the reportTitleList
        restReportTitleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reportTitle.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].source").value(hasItem(DEFAULT_SOURCE)))
            .andExpect(jsonPath("$.[*].field").value(hasItem(DEFAULT_FIELD)))
            .andExpect(jsonPath("$.[*].dataType").value(hasItem(DEFAULT_DATA_TYPE)))
            .andExpect(jsonPath("$.[*].index").value(hasItem(DEFAULT_INDEX.intValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)))
            .andExpect(jsonPath("$.[*].reportId").value(hasItem(DEFAULT_REPORT_ID.intValue())));
    }

    @Test
    @Transactional
    void getReportTitle() throws Exception {
        // Initialize the database
        reportTitleRepository.saveAndFlush(reportTitle);

        // Get the reportTitle
        restReportTitleMockMvc
            .perform(get(ENTITY_API_URL_ID, reportTitle.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reportTitle.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.source").value(DEFAULT_SOURCE))
            .andExpect(jsonPath("$.field").value(DEFAULT_FIELD))
            .andExpect(jsonPath("$.dataType").value(DEFAULT_DATA_TYPE))
            .andExpect(jsonPath("$.index").value(DEFAULT_INDEX.intValue()))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY))
            .andExpect(jsonPath("$.reportId").value(DEFAULT_REPORT_ID.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingReportTitle() throws Exception {
        // Get the reportTitle
        restReportTitleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReportTitle() throws Exception {
        // Initialize the database
        reportTitleRepository.saveAndFlush(reportTitle);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reportTitle
        ReportTitle updatedReportTitle = reportTitleRepository.findById(reportTitle.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedReportTitle are not directly saved in db
        em.detach(updatedReportTitle);
        updatedReportTitle
            .name(UPDATED_NAME)
            .source(UPDATED_SOURCE)
            .field(UPDATED_FIELD)
            .dataType(UPDATED_DATA_TYPE)
            .index(UPDATED_INDEX)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .reportId(UPDATED_REPORT_ID);

        restReportTitleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReportTitle.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedReportTitle))
            )
            .andExpect(status().isOk());

        // Validate the ReportTitle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedReportTitleToMatchAllProperties(updatedReportTitle);
    }

    @Test
    @Transactional
    void putNonExistingReportTitle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportTitle.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReportTitleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reportTitle.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reportTitle))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReportTitle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReportTitle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportTitle.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportTitleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reportTitle))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReportTitle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReportTitle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportTitle.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportTitleMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reportTitle)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReportTitle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReportTitleWithPatch() throws Exception {
        // Initialize the database
        reportTitleRepository.saveAndFlush(reportTitle);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reportTitle using partial update
        ReportTitle partialUpdatedReportTitle = new ReportTitle();
        partialUpdatedReportTitle.setId(reportTitle.getId());

        partialUpdatedReportTitle
            .name(UPDATED_NAME)
            .source(UPDATED_SOURCE)
            .dataType(UPDATED_DATA_TYPE)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);

        restReportTitleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReportTitle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReportTitle))
            )
            .andExpect(status().isOk());

        // Validate the ReportTitle in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReportTitleUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedReportTitle, reportTitle),
            getPersistedReportTitle(reportTitle)
        );
    }

    @Test
    @Transactional
    void fullUpdateReportTitleWithPatch() throws Exception {
        // Initialize the database
        reportTitleRepository.saveAndFlush(reportTitle);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reportTitle using partial update
        ReportTitle partialUpdatedReportTitle = new ReportTitle();
        partialUpdatedReportTitle.setId(reportTitle.getId());

        partialUpdatedReportTitle
            .name(UPDATED_NAME)
            .source(UPDATED_SOURCE)
            .field(UPDATED_FIELD)
            .dataType(UPDATED_DATA_TYPE)
            .index(UPDATED_INDEX)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY)
            .reportId(UPDATED_REPORT_ID);

        restReportTitleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReportTitle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReportTitle))
            )
            .andExpect(status().isOk());

        // Validate the ReportTitle in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReportTitleUpdatableFieldsEquals(partialUpdatedReportTitle, getPersistedReportTitle(partialUpdatedReportTitle));
    }

    @Test
    @Transactional
    void patchNonExistingReportTitle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportTitle.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReportTitleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reportTitle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reportTitle))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReportTitle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReportTitle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportTitle.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportTitleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reportTitle))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReportTitle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReportTitle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportTitle.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportTitleMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(reportTitle))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReportTitle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReportTitle() throws Exception {
        // Initialize the database
        reportTitleRepository.saveAndFlush(reportTitle);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the reportTitle
        restReportTitleMockMvc
            .perform(delete(ENTITY_API_URL_ID, reportTitle.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return reportTitleRepository.count();
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

    protected ReportTitle getPersistedReportTitle(ReportTitle reportTitle) {
        return reportTitleRepository.findById(reportTitle.getId()).orElseThrow();
    }

    protected void assertPersistedReportTitleToMatchAllProperties(ReportTitle expectedReportTitle) {
        assertReportTitleAllPropertiesEquals(expectedReportTitle, getPersistedReportTitle(expectedReportTitle));
    }

    protected void assertPersistedReportTitleToMatchUpdatableProperties(ReportTitle expectedReportTitle) {
        assertReportTitleAllUpdatablePropertiesEquals(expectedReportTitle, getPersistedReportTitle(expectedReportTitle));
    }
}
