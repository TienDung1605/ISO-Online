package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ReportTypeAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ReportType;
import com.mycompany.myapp.repository.ReportTypeRepository;
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
 * Integration tests for the {@link ReportTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReportTypeResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

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

    private static final String ENTITY_API_URL = "/api/report-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ReportTypeRepository reportTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReportTypeMockMvc;

    private ReportType reportType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReportType createEntity(EntityManager em) {
        ReportType reportType = new ReportType()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .status(DEFAULT_STATUS)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .updateBy(DEFAULT_UPDATE_BY);
        return reportType;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ReportType createUpdatedEntity(EntityManager em) {
        ReportType reportType = new ReportType()
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);
        return reportType;
    }

    @BeforeEach
    public void initTest() {
        reportType = createEntity(em);
    }

    @Test
    @Transactional
    void createReportType() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ReportType
        var returnedReportType = om.readValue(
            restReportTypeMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reportType))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ReportType.class
        );

        // Validate the ReportType in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertReportTypeUpdatableFieldsEquals(returnedReportType, getPersistedReportType(returnedReportType));
    }

    @Test
    @Transactional
    void createReportTypeWithExistingId() throws Exception {
        // Create the ReportType with an existing ID
        reportType.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReportTypeMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reportType)))
            .andExpect(status().isBadRequest());

        // Validate the ReportType in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReportTypes() throws Exception {
        // Initialize the database
        reportTypeRepository.saveAndFlush(reportType);

        // Get all the reportTypeList
        restReportTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reportType.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)));
    }

    @Test
    @Transactional
    void getReportType() throws Exception {
        // Initialize the database
        reportTypeRepository.saveAndFlush(reportType);

        // Get the reportType
        restReportTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, reportType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reportType.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY));
    }

    @Test
    @Transactional
    void getNonExistingReportType() throws Exception {
        // Get the reportType
        restReportTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReportType() throws Exception {
        // Initialize the database
        reportTypeRepository.saveAndFlush(reportType);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reportType
        ReportType updatedReportType = reportTypeRepository.findById(reportType.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedReportType are not directly saved in db
        em.detach(updatedReportType);
        updatedReportType
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restReportTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReportType.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedReportType))
            )
            .andExpect(status().isOk());

        // Validate the ReportType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedReportTypeToMatchAllProperties(updatedReportType);
    }

    @Test
    @Transactional
    void putNonExistingReportType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportType.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReportTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reportType.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reportType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReportType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReportType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportType.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reportType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReportType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReportType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportType.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportTypeMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reportType)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReportType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReportTypeWithPatch() throws Exception {
        // Initialize the database
        reportTypeRepository.saveAndFlush(reportType);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reportType using partial update
        ReportType partialUpdatedReportType = new ReportType();
        partialUpdatedReportType.setId(reportType.getId());

        partialUpdatedReportType.createdAt(UPDATED_CREATED_AT);

        restReportTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReportType.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReportType))
            )
            .andExpect(status().isOk());

        // Validate the ReportType in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReportTypeUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedReportType, reportType),
            getPersistedReportType(reportType)
        );
    }

    @Test
    @Transactional
    void fullUpdateReportTypeWithPatch() throws Exception {
        // Initialize the database
        reportTypeRepository.saveAndFlush(reportType);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reportType using partial update
        ReportType partialUpdatedReportType = new ReportType();
        partialUpdatedReportType.setId(reportType.getId());

        partialUpdatedReportType
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restReportTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReportType.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReportType))
            )
            .andExpect(status().isOk());

        // Validate the ReportType in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReportTypeUpdatableFieldsEquals(partialUpdatedReportType, getPersistedReportType(partialUpdatedReportType));
    }

    @Test
    @Transactional
    void patchNonExistingReportType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportType.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReportTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reportType.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reportType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReportType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReportType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportType.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reportType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ReportType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReportType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reportType.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReportTypeMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(reportType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ReportType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReportType() throws Exception {
        // Initialize the database
        reportTypeRepository.saveAndFlush(reportType);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the reportType
        restReportTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, reportType.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return reportTypeRepository.count();
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

    protected ReportType getPersistedReportType(ReportType reportType) {
        return reportTypeRepository.findById(reportType.getId()).orElseThrow();
    }

    protected void assertPersistedReportTypeToMatchAllProperties(ReportType expectedReportType) {
        assertReportTypeAllPropertiesEquals(expectedReportType, getPersistedReportType(expectedReportType));
    }

    protected void assertPersistedReportTypeToMatchUpdatableProperties(ReportType expectedReportType) {
        assertReportTypeAllUpdatablePropertiesEquals(expectedReportType, getPersistedReportType(expectedReportType));
    }
}
