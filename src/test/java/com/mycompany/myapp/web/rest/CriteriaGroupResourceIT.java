package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.CriteriaGroupAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CriteriaGroup;
import com.mycompany.myapp.repository.CriteriaGroupRepository;
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
 * Integration tests for the {@link CriteriaGroupResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CriteriaGroupResourceIT {

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

    private static final String ENTITY_API_URL = "/api/criteria-groups";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CriteriaGroupRepository criteriaGroupRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCriteriaGroupMockMvc;

    private CriteriaGroup criteriaGroup;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CriteriaGroup createEntity(EntityManager em) {
        CriteriaGroup criteriaGroup = new CriteriaGroup()
            .name(DEFAULT_NAME)
            .status(DEFAULT_STATUS)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .updateBy(DEFAULT_UPDATE_BY);
        return criteriaGroup;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CriteriaGroup createUpdatedEntity(EntityManager em) {
        CriteriaGroup criteriaGroup = new CriteriaGroup()
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);
        return criteriaGroup;
    }

    @BeforeEach
    public void initTest() {
        criteriaGroup = createEntity(em);
    }

    @Test
    @Transactional
    void createCriteriaGroup() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the CriteriaGroup
        var returnedCriteriaGroup = om.readValue(
            restCriteriaGroupMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(criteriaGroup))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            CriteriaGroup.class
        );

        // Validate the CriteriaGroup in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCriteriaGroupUpdatableFieldsEquals(returnedCriteriaGroup, getPersistedCriteriaGroup(returnedCriteriaGroup));
    }

    @Test
    @Transactional
    void createCriteriaGroupWithExistingId() throws Exception {
        // Create the CriteriaGroup with an existing ID
        criteriaGroup.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCriteriaGroupMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(criteriaGroup)))
            .andExpect(status().isBadRequest());

        // Validate the CriteriaGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCriteriaGroups() throws Exception {
        // Initialize the database
        criteriaGroupRepository.saveAndFlush(criteriaGroup);

        // Get all the criteriaGroupList
        restCriteriaGroupMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(criteriaGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)));
    }

    @Test
    @Transactional
    void getCriteriaGroup() throws Exception {
        // Initialize the database
        criteriaGroupRepository.saveAndFlush(criteriaGroup);

        // Get the criteriaGroup
        restCriteriaGroupMockMvc
            .perform(get(ENTITY_API_URL_ID, criteriaGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(criteriaGroup.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY));
    }

    @Test
    @Transactional
    void getNonExistingCriteriaGroup() throws Exception {
        // Get the criteriaGroup
        restCriteriaGroupMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCriteriaGroup() throws Exception {
        // Initialize the database
        criteriaGroupRepository.saveAndFlush(criteriaGroup);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the criteriaGroup
        CriteriaGroup updatedCriteriaGroup = criteriaGroupRepository.findById(criteriaGroup.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCriteriaGroup are not directly saved in db
        em.detach(updatedCriteriaGroup);
        updatedCriteriaGroup
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restCriteriaGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCriteriaGroup.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCriteriaGroup))
            )
            .andExpect(status().isOk());

        // Validate the CriteriaGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCriteriaGroupToMatchAllProperties(updatedCriteriaGroup);
    }

    @Test
    @Transactional
    void putNonExistingCriteriaGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        criteriaGroup.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCriteriaGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, criteriaGroup.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(criteriaGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCriteriaGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        criteriaGroup.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(criteriaGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCriteriaGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        criteriaGroup.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaGroupMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(criteriaGroup)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CriteriaGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCriteriaGroupWithPatch() throws Exception {
        // Initialize the database
        criteriaGroupRepository.saveAndFlush(criteriaGroup);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the criteriaGroup using partial update
        CriteriaGroup partialUpdatedCriteriaGroup = new CriteriaGroup();
        partialUpdatedCriteriaGroup.setId(criteriaGroup.getId());

        partialUpdatedCriteriaGroup.updatedAt(UPDATED_UPDATED_AT);

        restCriteriaGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCriteriaGroup.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCriteriaGroup))
            )
            .andExpect(status().isOk());

        // Validate the CriteriaGroup in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCriteriaGroupUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedCriteriaGroup, criteriaGroup),
            getPersistedCriteriaGroup(criteriaGroup)
        );
    }

    @Test
    @Transactional
    void fullUpdateCriteriaGroupWithPatch() throws Exception {
        // Initialize the database
        criteriaGroupRepository.saveAndFlush(criteriaGroup);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the criteriaGroup using partial update
        CriteriaGroup partialUpdatedCriteriaGroup = new CriteriaGroup();
        partialUpdatedCriteriaGroup.setId(criteriaGroup.getId());

        partialUpdatedCriteriaGroup
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restCriteriaGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCriteriaGroup.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCriteriaGroup))
            )
            .andExpect(status().isOk());

        // Validate the CriteriaGroup in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCriteriaGroupUpdatableFieldsEquals(partialUpdatedCriteriaGroup, getPersistedCriteriaGroup(partialUpdatedCriteriaGroup));
    }

    @Test
    @Transactional
    void patchNonExistingCriteriaGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        criteriaGroup.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCriteriaGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, criteriaGroup.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(criteriaGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCriteriaGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        criteriaGroup.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(criteriaGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCriteriaGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        criteriaGroup.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaGroupMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(criteriaGroup))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CriteriaGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCriteriaGroup() throws Exception {
        // Initialize the database
        criteriaGroupRepository.saveAndFlush(criteriaGroup);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the criteriaGroup
        restCriteriaGroupMockMvc
            .perform(delete(ENTITY_API_URL_ID, criteriaGroup.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return criteriaGroupRepository.count();
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

    protected CriteriaGroup getPersistedCriteriaGroup(CriteriaGroup criteriaGroup) {
        return criteriaGroupRepository.findById(criteriaGroup.getId()).orElseThrow();
    }

    protected void assertPersistedCriteriaGroupToMatchAllProperties(CriteriaGroup expectedCriteriaGroup) {
        assertCriteriaGroupAllPropertiesEquals(expectedCriteriaGroup, getPersistedCriteriaGroup(expectedCriteriaGroup));
    }

    protected void assertPersistedCriteriaGroupToMatchUpdatableProperties(CriteriaGroup expectedCriteriaGroup) {
        assertCriteriaGroupAllUpdatablePropertiesEquals(expectedCriteriaGroup, getPersistedCriteriaGroup(expectedCriteriaGroup));
    }
}
