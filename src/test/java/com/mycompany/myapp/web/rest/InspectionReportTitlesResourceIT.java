package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.InspectionReportTitlesAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.InspectionReportTitles;
import com.mycompany.myapp.repository.InspectionReportTitlesRepository;
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
 * Integration tests for the {@link InspectionReportTitlesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InspectionReportTitlesResourceIT {

    private static final String DEFAULT_NAME_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_NAME_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_SOURCE = "AAAAAAAAAA";
    private static final String UPDATED_SOURCE = "BBBBBBBBBB";

    private static final String DEFAULT_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_FIELD = "BBBBBBBBBB";

    private static final String DEFAULT_DATA_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_DATA_TYPE = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_TIME_CREATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME_CREATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_TIME_UPDATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME_UPDATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Long DEFAULT_SAMPLE_REPORT_ID = 1L;
    private static final Long UPDATED_SAMPLE_REPORT_ID = 2L;

    private static final String ENTITY_API_URL = "/api/inspection-report-titles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private InspectionReportTitlesRepository inspectionReportTitlesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInspectionReportTitlesMockMvc;

    private InspectionReportTitles inspectionReportTitles;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InspectionReportTitles createEntity(EntityManager em) {
        InspectionReportTitles inspectionReportTitles = new InspectionReportTitles()
            .nameTitle(DEFAULT_NAME_TITLE)
            .source(DEFAULT_SOURCE)
            .field(DEFAULT_FIELD)
            .dataType(DEFAULT_DATA_TYPE)
            .timeCreate(DEFAULT_TIME_CREATE)
            .timeUpdate(DEFAULT_TIME_UPDATE)
            .sampleReportId(DEFAULT_SAMPLE_REPORT_ID);
        return inspectionReportTitles;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InspectionReportTitles createUpdatedEntity(EntityManager em) {
        InspectionReportTitles inspectionReportTitles = new InspectionReportTitles()
            .nameTitle(UPDATED_NAME_TITLE)
            .source(UPDATED_SOURCE)
            .field(UPDATED_FIELD)
            .dataType(UPDATED_DATA_TYPE)
            .timeCreate(UPDATED_TIME_CREATE)
            .timeUpdate(UPDATED_TIME_UPDATE)
            .sampleReportId(UPDATED_SAMPLE_REPORT_ID);
        return inspectionReportTitles;
    }

    @BeforeEach
    public void initTest() {
        inspectionReportTitles = createEntity(em);
    }

    @Test
    @Transactional
    void createInspectionReportTitles() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the InspectionReportTitles
        var returnedInspectionReportTitles = om.readValue(
            restInspectionReportTitlesMockMvc
                .perform(
                    post(ENTITY_API_URL)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsBytes(inspectionReportTitles))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            InspectionReportTitles.class
        );

        // Validate the InspectionReportTitles in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertInspectionReportTitlesUpdatableFieldsEquals(
            returnedInspectionReportTitles,
            getPersistedInspectionReportTitles(returnedInspectionReportTitles)
        );
    }

    @Test
    @Transactional
    void createInspectionReportTitlesWithExistingId() throws Exception {
        // Create the InspectionReportTitles with an existing ID
        inspectionReportTitles.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInspectionReportTitlesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(inspectionReportTitles))
            )
            .andExpect(status().isBadRequest());

        // Validate the InspectionReportTitles in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInspectionReportTitles() throws Exception {
        // Initialize the database
        inspectionReportTitlesRepository.saveAndFlush(inspectionReportTitles);

        // Get all the inspectionReportTitlesList
        restInspectionReportTitlesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(inspectionReportTitles.getId().intValue())))
            .andExpect(jsonPath("$.[*].nameTitle").value(hasItem(DEFAULT_NAME_TITLE)))
            .andExpect(jsonPath("$.[*].source").value(hasItem(DEFAULT_SOURCE)))
            .andExpect(jsonPath("$.[*].field").value(hasItem(DEFAULT_FIELD)))
            .andExpect(jsonPath("$.[*].dataType").value(hasItem(DEFAULT_DATA_TYPE)))
            .andExpect(jsonPath("$.[*].timeCreate").value(hasItem(sameInstant(DEFAULT_TIME_CREATE))))
            .andExpect(jsonPath("$.[*].timeUpdate").value(hasItem(sameInstant(DEFAULT_TIME_UPDATE))))
            .andExpect(jsonPath("$.[*].sampleReportId").value(hasItem(DEFAULT_SAMPLE_REPORT_ID.intValue())));
    }

    @Test
    @Transactional
    void getInspectionReportTitles() throws Exception {
        // Initialize the database
        inspectionReportTitlesRepository.saveAndFlush(inspectionReportTitles);

        // Get the inspectionReportTitles
        restInspectionReportTitlesMockMvc
            .perform(get(ENTITY_API_URL_ID, inspectionReportTitles.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(inspectionReportTitles.getId().intValue()))
            .andExpect(jsonPath("$.nameTitle").value(DEFAULT_NAME_TITLE))
            .andExpect(jsonPath("$.source").value(DEFAULT_SOURCE))
            .andExpect(jsonPath("$.field").value(DEFAULT_FIELD))
            .andExpect(jsonPath("$.dataType").value(DEFAULT_DATA_TYPE))
            .andExpect(jsonPath("$.timeCreate").value(sameInstant(DEFAULT_TIME_CREATE)))
            .andExpect(jsonPath("$.timeUpdate").value(sameInstant(DEFAULT_TIME_UPDATE)))
            .andExpect(jsonPath("$.sampleReportId").value(DEFAULT_SAMPLE_REPORT_ID.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingInspectionReportTitles() throws Exception {
        // Get the inspectionReportTitles
        restInspectionReportTitlesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingInspectionReportTitles() throws Exception {
        // Initialize the database
        inspectionReportTitlesRepository.saveAndFlush(inspectionReportTitles);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the inspectionReportTitles
        InspectionReportTitles updatedInspectionReportTitles = inspectionReportTitlesRepository
            .findById(inspectionReportTitles.getId())
            .orElseThrow();
        // Disconnect from session so that the updates on updatedInspectionReportTitles are not directly saved in db
        em.detach(updatedInspectionReportTitles);
        updatedInspectionReportTitles
            .nameTitle(UPDATED_NAME_TITLE)
            .source(UPDATED_SOURCE)
            .field(UPDATED_FIELD)
            .dataType(UPDATED_DATA_TYPE)
            .timeCreate(UPDATED_TIME_CREATE)
            .timeUpdate(UPDATED_TIME_UPDATE)
            .sampleReportId(UPDATED_SAMPLE_REPORT_ID);

        restInspectionReportTitlesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInspectionReportTitles.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedInspectionReportTitles))
            )
            .andExpect(status().isOk());

        // Validate the InspectionReportTitles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedInspectionReportTitlesToMatchAllProperties(updatedInspectionReportTitles);
    }

    @Test
    @Transactional
    void putNonExistingInspectionReportTitles() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        inspectionReportTitles.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInspectionReportTitlesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, inspectionReportTitles.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(inspectionReportTitles))
            )
            .andExpect(status().isBadRequest());

        // Validate the InspectionReportTitles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInspectionReportTitles() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        inspectionReportTitles.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInspectionReportTitlesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(inspectionReportTitles))
            )
            .andExpect(status().isBadRequest());

        // Validate the InspectionReportTitles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInspectionReportTitles() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        inspectionReportTitles.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInspectionReportTitlesMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(inspectionReportTitles))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the InspectionReportTitles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInspectionReportTitlesWithPatch() throws Exception {
        // Initialize the database
        inspectionReportTitlesRepository.saveAndFlush(inspectionReportTitles);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the inspectionReportTitles using partial update
        InspectionReportTitles partialUpdatedInspectionReportTitles = new InspectionReportTitles();
        partialUpdatedInspectionReportTitles.setId(inspectionReportTitles.getId());

        partialUpdatedInspectionReportTitles.dataType(UPDATED_DATA_TYPE).sampleReportId(UPDATED_SAMPLE_REPORT_ID);

        restInspectionReportTitlesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInspectionReportTitles.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedInspectionReportTitles))
            )
            .andExpect(status().isOk());

        // Validate the InspectionReportTitles in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertInspectionReportTitlesUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedInspectionReportTitles, inspectionReportTitles),
            getPersistedInspectionReportTitles(inspectionReportTitles)
        );
    }

    @Test
    @Transactional
    void fullUpdateInspectionReportTitlesWithPatch() throws Exception {
        // Initialize the database
        inspectionReportTitlesRepository.saveAndFlush(inspectionReportTitles);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the inspectionReportTitles using partial update
        InspectionReportTitles partialUpdatedInspectionReportTitles = new InspectionReportTitles();
        partialUpdatedInspectionReportTitles.setId(inspectionReportTitles.getId());

        partialUpdatedInspectionReportTitles
            .nameTitle(UPDATED_NAME_TITLE)
            .source(UPDATED_SOURCE)
            .field(UPDATED_FIELD)
            .dataType(UPDATED_DATA_TYPE)
            .timeCreate(UPDATED_TIME_CREATE)
            .timeUpdate(UPDATED_TIME_UPDATE)
            .sampleReportId(UPDATED_SAMPLE_REPORT_ID);

        restInspectionReportTitlesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInspectionReportTitles.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedInspectionReportTitles))
            )
            .andExpect(status().isOk());

        // Validate the InspectionReportTitles in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertInspectionReportTitlesUpdatableFieldsEquals(
            partialUpdatedInspectionReportTitles,
            getPersistedInspectionReportTitles(partialUpdatedInspectionReportTitles)
        );
    }

    @Test
    @Transactional
    void patchNonExistingInspectionReportTitles() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        inspectionReportTitles.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInspectionReportTitlesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, inspectionReportTitles.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(inspectionReportTitles))
            )
            .andExpect(status().isBadRequest());

        // Validate the InspectionReportTitles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInspectionReportTitles() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        inspectionReportTitles.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInspectionReportTitlesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(inspectionReportTitles))
            )
            .andExpect(status().isBadRequest());

        // Validate the InspectionReportTitles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInspectionReportTitles() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        inspectionReportTitles.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInspectionReportTitlesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(inspectionReportTitles))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the InspectionReportTitles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInspectionReportTitles() throws Exception {
        // Initialize the database
        inspectionReportTitlesRepository.saveAndFlush(inspectionReportTitles);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the inspectionReportTitles
        restInspectionReportTitlesMockMvc
            .perform(delete(ENTITY_API_URL_ID, inspectionReportTitles.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return inspectionReportTitlesRepository.count();
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

    protected InspectionReportTitles getPersistedInspectionReportTitles(InspectionReportTitles inspectionReportTitles) {
        return inspectionReportTitlesRepository.findById(inspectionReportTitles.getId()).orElseThrow();
    }

    protected void assertPersistedInspectionReportTitlesToMatchAllProperties(InspectionReportTitles expectedInspectionReportTitles) {
        assertInspectionReportTitlesAllPropertiesEquals(
            expectedInspectionReportTitles,
            getPersistedInspectionReportTitles(expectedInspectionReportTitles)
        );
    }

    protected void assertPersistedInspectionReportTitlesToMatchUpdatableProperties(InspectionReportTitles expectedInspectionReportTitles) {
        assertInspectionReportTitlesAllUpdatablePropertiesEquals(
            expectedInspectionReportTitles,
            getPersistedInspectionReportTitles(expectedInspectionReportTitles)
        );
    }
}
