package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.PlanAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Plan;
import com.mycompany.myapp.repository.PlanRepository;
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
 * Integration tests for the {@link PlanResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PlanResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SUBJECT_OF_ASSETMENT_PLAN = "AAAAAAAAAA";
    private static final String UPDATED_SUBJECT_OF_ASSETMENT_PLAN = "BBBBBBBBBB";

    private static final String DEFAULT_FREQUENCY = "AAAAAAAAAA";
    private static final String UPDATED_FREQUENCY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_TIME_START = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME_START = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_TIME_END = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME_END = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_STATUS_PLAN = "AAAAAAAAAA";
    private static final String UPDATED_STATUS_PLAN = "BBBBBBBBBB";

    private static final String DEFAULT_TEST_OBJECT = "AAAAAAAAAA";
    private static final String UPDATED_TEST_OBJECT = "BBBBBBBBBB";

    private static final Long DEFAULT_REPORT_TYPE_ID = 1L;
    private static final Long UPDATED_REPORT_TYPE_ID = 2L;

    private static final String DEFAULT_REPORT_TYPE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_REPORT_TYPE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_NUMBER_OF_CHECK = "AAAAAAAAAA";
    private static final String UPDATED_NUMBER_OF_CHECK = "BBBBBBBBBB";

    private static final String DEFAULT_IMPLEMENTER = "AAAAAAAAAA";
    private static final String UPDATED_IMPLEMENTER = "BBBBBBBBBB";

    private static final String DEFAULT_PATICIPANT = "AAAAAAAAAA";
    private static final String UPDATED_PATICIPANT = "BBBBBBBBBB";

    private static final String DEFAULT_CHECKER_GROUP = "AAAAAAAAAA";
    private static final String UPDATED_CHECKER_GROUP = "BBBBBBBBBB";

    private static final String DEFAULT_CHECKER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CHECKER_NAME = "BBBBBBBBBB";

    private static final Long DEFAULT_CHECKER_GROUP_ID = 1L;
    private static final Long UPDATED_CHECKER_GROUP_ID = 2L;

    private static final Long DEFAULT_CHECKER_ID = 1L;
    private static final Long UPDATED_CHECKER_ID = 2L;

    private static final String DEFAULT_GROSS = "AAAAAAAAAA";
    private static final String UPDATED_GROSS = "BBBBBBBBBB";

    private static final String DEFAULT_TIME_CHECK = "AAAAAAAAAA";
    private static final String UPDATED_TIME_CHECK = "BBBBBBBBBB";

    private static final String DEFAULT_NAME_RESULT = "AAAAAAAAAA";
    private static final String UPDATED_NAME_RESULT = "BBBBBBBBBB";

    private static final Long DEFAULT_SCRIPT_ID = 1L;
    private static final Long UPDATED_SCRIPT_ID = 2L;

    private static final String DEFAULT_CREATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATE_BY = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_UPDATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/plans";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlanMockMvc;

    private Plan plan;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plan createEntity(EntityManager em) {
        Plan plan = new Plan()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .subjectOfAssetmentPlan(DEFAULT_SUBJECT_OF_ASSETMENT_PLAN)
            .frequency(DEFAULT_FREQUENCY)
            .timeStart(DEFAULT_TIME_START)
            .timeEnd(DEFAULT_TIME_END)
            .statusPlan(DEFAULT_STATUS_PLAN)
            .testObject(DEFAULT_TEST_OBJECT)
            .reportTypeId(DEFAULT_REPORT_TYPE_ID)
            .reportTypeName(DEFAULT_REPORT_TYPE_NAME)
            .numberOfCheck(DEFAULT_NUMBER_OF_CHECK)
            .implementer(DEFAULT_IMPLEMENTER)
            .paticipant(DEFAULT_PATICIPANT)
            .checkerGroup(DEFAULT_CHECKER_GROUP)
            .checkerName(DEFAULT_CHECKER_NAME)
            .checkerGroupId(DEFAULT_CHECKER_GROUP_ID)
            .checkerId(DEFAULT_CHECKER_ID)
            .gross(DEFAULT_GROSS)
            .timeCheck(DEFAULT_TIME_CHECK)
            .nameResult(DEFAULT_NAME_RESULT)
            .scriptId(DEFAULT_SCRIPT_ID)
            .createBy(DEFAULT_CREATE_BY)
            .status(DEFAULT_STATUS)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .updateBy(DEFAULT_UPDATE_BY);
        return plan;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plan createUpdatedEntity(EntityManager em) {
        Plan plan = new Plan()
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .subjectOfAssetmentPlan(UPDATED_SUBJECT_OF_ASSETMENT_PLAN)
            .frequency(UPDATED_FREQUENCY)
            .timeStart(UPDATED_TIME_START)
            .timeEnd(UPDATED_TIME_END)
            .statusPlan(UPDATED_STATUS_PLAN)
            .testObject(UPDATED_TEST_OBJECT)
            .reportTypeId(UPDATED_REPORT_TYPE_ID)
            .reportTypeName(UPDATED_REPORT_TYPE_NAME)
            .numberOfCheck(UPDATED_NUMBER_OF_CHECK)
            .implementer(UPDATED_IMPLEMENTER)
            .paticipant(UPDATED_PATICIPANT)
            .checkerGroup(UPDATED_CHECKER_GROUP)
            .checkerName(UPDATED_CHECKER_NAME)
            .checkerGroupId(UPDATED_CHECKER_GROUP_ID)
            .checkerId(UPDATED_CHECKER_ID)
            .gross(UPDATED_GROSS)
            .timeCheck(UPDATED_TIME_CHECK)
            .nameResult(UPDATED_NAME_RESULT)
            .scriptId(UPDATED_SCRIPT_ID)
            .createBy(UPDATED_CREATE_BY)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);
        return plan;
    }

    @BeforeEach
    public void initTest() {
        plan = createEntity(em);
    }

    @Test
    @Transactional
    void createPlan() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Plan
        var returnedPlan = om.readValue(
            restPlanMockMvc
                .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(plan)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Plan.class
        );

        // Validate the Plan in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPlanUpdatableFieldsEquals(returnedPlan, getPersistedPlan(returnedPlan));
    }

    @Test
    @Transactional
    void createPlanWithExistingId() throws Exception {
        // Create the Plan with an existing ID
        plan.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlanMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(plan)))
            .andExpect(status().isBadRequest());

        // Validate the Plan in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPlans() throws Exception {
        // Initialize the database
        planRepository.saveAndFlush(plan);

        // Get all the planList
        restPlanMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(plan.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].subjectOfAssetmentPlan").value(hasItem(DEFAULT_SUBJECT_OF_ASSETMENT_PLAN)))
            .andExpect(jsonPath("$.[*].frequency").value(hasItem(DEFAULT_FREQUENCY)))
            .andExpect(jsonPath("$.[*].timeStart").value(hasItem(sameInstant(DEFAULT_TIME_START))))
            .andExpect(jsonPath("$.[*].timeEnd").value(hasItem(sameInstant(DEFAULT_TIME_END))))
            .andExpect(jsonPath("$.[*].statusPlan").value(hasItem(DEFAULT_STATUS_PLAN)))
            .andExpect(jsonPath("$.[*].testObject").value(hasItem(DEFAULT_TEST_OBJECT)))
            .andExpect(jsonPath("$.[*].reportTypeId").value(hasItem(DEFAULT_REPORT_TYPE_ID.intValue())))
            .andExpect(jsonPath("$.[*].reportTypeName").value(hasItem(DEFAULT_REPORT_TYPE_NAME)))
            .andExpect(jsonPath("$.[*].numberOfCheck").value(hasItem(DEFAULT_NUMBER_OF_CHECK)))
            .andExpect(jsonPath("$.[*].implementer").value(hasItem(DEFAULT_IMPLEMENTER)))
            .andExpect(jsonPath("$.[*].paticipant").value(hasItem(DEFAULT_PATICIPANT)))
            .andExpect(jsonPath("$.[*].checkerGroup").value(hasItem(DEFAULT_CHECKER_GROUP)))
            .andExpect(jsonPath("$.[*].checkerName").value(hasItem(DEFAULT_CHECKER_NAME)))
            .andExpect(jsonPath("$.[*].checkerGroupId").value(hasItem(DEFAULT_CHECKER_GROUP_ID.intValue())))
            .andExpect(jsonPath("$.[*].checkerId").value(hasItem(DEFAULT_CHECKER_ID.intValue())))
            .andExpect(jsonPath("$.[*].gross").value(hasItem(DEFAULT_GROSS)))
            .andExpect(jsonPath("$.[*].timeCheck").value(hasItem(DEFAULT_TIME_CHECK)))
            .andExpect(jsonPath("$.[*].nameResult").value(hasItem(DEFAULT_NAME_RESULT)))
            .andExpect(jsonPath("$.[*].scriptId").value(hasItem(DEFAULT_SCRIPT_ID.intValue())))
            .andExpect(jsonPath("$.[*].createBy").value(hasItem(DEFAULT_CREATE_BY)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)));
    }

    @Test
    @Transactional
    void getPlan() throws Exception {
        // Initialize the database
        planRepository.saveAndFlush(plan);

        // Get the plan
        restPlanMockMvc
            .perform(get(ENTITY_API_URL_ID, plan.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(plan.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.subjectOfAssetmentPlan").value(DEFAULT_SUBJECT_OF_ASSETMENT_PLAN))
            .andExpect(jsonPath("$.frequency").value(DEFAULT_FREQUENCY))
            .andExpect(jsonPath("$.timeStart").value(sameInstant(DEFAULT_TIME_START)))
            .andExpect(jsonPath("$.timeEnd").value(sameInstant(DEFAULT_TIME_END)))
            .andExpect(jsonPath("$.statusPlan").value(DEFAULT_STATUS_PLAN))
            .andExpect(jsonPath("$.testObject").value(DEFAULT_TEST_OBJECT))
            .andExpect(jsonPath("$.reportTypeId").value(DEFAULT_REPORT_TYPE_ID.intValue()))
            .andExpect(jsonPath("$.reportTypeName").value(DEFAULT_REPORT_TYPE_NAME))
            .andExpect(jsonPath("$.numberOfCheck").value(DEFAULT_NUMBER_OF_CHECK))
            .andExpect(jsonPath("$.implementer").value(DEFAULT_IMPLEMENTER))
            .andExpect(jsonPath("$.paticipant").value(DEFAULT_PATICIPANT))
            .andExpect(jsonPath("$.checkerGroup").value(DEFAULT_CHECKER_GROUP))
            .andExpect(jsonPath("$.checkerName").value(DEFAULT_CHECKER_NAME))
            .andExpect(jsonPath("$.checkerGroupId").value(DEFAULT_CHECKER_GROUP_ID.intValue()))
            .andExpect(jsonPath("$.checkerId").value(DEFAULT_CHECKER_ID.intValue()))
            .andExpect(jsonPath("$.gross").value(DEFAULT_GROSS))
            .andExpect(jsonPath("$.timeCheck").value(DEFAULT_TIME_CHECK))
            .andExpect(jsonPath("$.nameResult").value(DEFAULT_NAME_RESULT))
            .andExpect(jsonPath("$.scriptId").value(DEFAULT_SCRIPT_ID.intValue()))
            .andExpect(jsonPath("$.createBy").value(DEFAULT_CREATE_BY))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY));
    }

    @Test
    @Transactional
    void getNonExistingPlan() throws Exception {
        // Get the plan
        restPlanMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPlan() throws Exception {
        // Initialize the database
        planRepository.saveAndFlush(plan);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the plan
        Plan updatedPlan = planRepository.findById(plan.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPlan are not directly saved in db
        em.detach(updatedPlan);
        updatedPlan
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .subjectOfAssetmentPlan(UPDATED_SUBJECT_OF_ASSETMENT_PLAN)
            .frequency(UPDATED_FREQUENCY)
            .timeStart(UPDATED_TIME_START)
            .timeEnd(UPDATED_TIME_END)
            .statusPlan(UPDATED_STATUS_PLAN)
            .testObject(UPDATED_TEST_OBJECT)
            .reportTypeId(UPDATED_REPORT_TYPE_ID)
            .reportTypeName(UPDATED_REPORT_TYPE_NAME)
            .numberOfCheck(UPDATED_NUMBER_OF_CHECK)
            .implementer(UPDATED_IMPLEMENTER)
            .paticipant(UPDATED_PATICIPANT)
            .checkerGroup(UPDATED_CHECKER_GROUP)
            .checkerName(UPDATED_CHECKER_NAME)
            .checkerGroupId(UPDATED_CHECKER_GROUP_ID)
            .checkerId(UPDATED_CHECKER_ID)
            .gross(UPDATED_GROSS)
            .timeCheck(UPDATED_TIME_CHECK)
            .nameResult(UPDATED_NAME_RESULT)
            .scriptId(UPDATED_SCRIPT_ID)
            .createBy(UPDATED_CREATE_BY)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restPlanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPlan.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPlan))
            )
            .andExpect(status().isOk());

        // Validate the Plan in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPlanToMatchAllProperties(updatedPlan);
    }

    @Test
    @Transactional
    void putNonExistingPlan() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        plan.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, plan.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(plan))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plan in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlan() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        plan.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(plan))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plan in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlan() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        plan.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlanMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(plan)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plan in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlanWithPatch() throws Exception {
        // Initialize the database
        planRepository.saveAndFlush(plan);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the plan using partial update
        Plan partialUpdatedPlan = new Plan();
        partialUpdatedPlan.setId(plan.getId());

        partialUpdatedPlan
            .timeEnd(UPDATED_TIME_END)
            .statusPlan(UPDATED_STATUS_PLAN)
            .testObject(UPDATED_TEST_OBJECT)
            .reportTypeName(UPDATED_REPORT_TYPE_NAME)
            .numberOfCheck(UPDATED_NUMBER_OF_CHECK)
            .implementer(UPDATED_IMPLEMENTER)
            .checkerId(UPDATED_CHECKER_ID)
            .gross(UPDATED_GROSS)
            .scriptId(UPDATED_SCRIPT_ID)
            .status(UPDATED_STATUS)
            .updateBy(UPDATED_UPDATE_BY);

        restPlanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlan.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlan))
            )
            .andExpect(status().isOk());

        // Validate the Plan in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlanUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedPlan, plan), getPersistedPlan(plan));
    }

    @Test
    @Transactional
    void fullUpdatePlanWithPatch() throws Exception {
        // Initialize the database
        planRepository.saveAndFlush(plan);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the plan using partial update
        Plan partialUpdatedPlan = new Plan();
        partialUpdatedPlan.setId(plan.getId());

        partialUpdatedPlan
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .subjectOfAssetmentPlan(UPDATED_SUBJECT_OF_ASSETMENT_PLAN)
            .frequency(UPDATED_FREQUENCY)
            .timeStart(UPDATED_TIME_START)
            .timeEnd(UPDATED_TIME_END)
            .statusPlan(UPDATED_STATUS_PLAN)
            .testObject(UPDATED_TEST_OBJECT)
            .reportTypeId(UPDATED_REPORT_TYPE_ID)
            .reportTypeName(UPDATED_REPORT_TYPE_NAME)
            .numberOfCheck(UPDATED_NUMBER_OF_CHECK)
            .implementer(UPDATED_IMPLEMENTER)
            .paticipant(UPDATED_PATICIPANT)
            .checkerGroup(UPDATED_CHECKER_GROUP)
            .checkerName(UPDATED_CHECKER_NAME)
            .checkerGroupId(UPDATED_CHECKER_GROUP_ID)
            .checkerId(UPDATED_CHECKER_ID)
            .gross(UPDATED_GROSS)
            .timeCheck(UPDATED_TIME_CHECK)
            .nameResult(UPDATED_NAME_RESULT)
            .scriptId(UPDATED_SCRIPT_ID)
            .createBy(UPDATED_CREATE_BY)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restPlanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlan.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlan))
            )
            .andExpect(status().isOk());

        // Validate the Plan in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlanUpdatableFieldsEquals(partialUpdatedPlan, getPersistedPlan(partialUpdatedPlan));
    }

    @Test
    @Transactional
    void patchNonExistingPlan() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        plan.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, plan.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(plan))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plan in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlan() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        plan.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(plan))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plan in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlan() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        plan.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlanMockMvc
            .perform(patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(plan)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plan in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlan() throws Exception {
        // Initialize the database
        planRepository.saveAndFlush(plan);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the plan
        restPlanMockMvc
            .perform(delete(ENTITY_API_URL_ID, plan.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return planRepository.count();
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

    protected Plan getPersistedPlan(Plan plan) {
        return planRepository.findById(plan.getId()).orElseThrow();
    }

    protected void assertPersistedPlanToMatchAllProperties(Plan expectedPlan) {
        assertPlanAllPropertiesEquals(expectedPlan, getPersistedPlan(expectedPlan));
    }

    protected void assertPersistedPlanToMatchUpdatableProperties(Plan expectedPlan) {
        assertPlanAllUpdatablePropertiesEquals(expectedPlan, getPersistedPlan(expectedPlan));
    }
}
