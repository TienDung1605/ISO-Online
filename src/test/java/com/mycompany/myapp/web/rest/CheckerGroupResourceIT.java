package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.CheckerGroupAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CheckerGroup;
import com.mycompany.myapp.repository.CheckerGroupRepository;
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
 * Integration tests for the {@link CheckerGroupResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CheckerGroupResourceIT {

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

    private static final String ENTITY_API_URL = "/api/checker-groups";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CheckerGroupRepository checkerGroupRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCheckerGroupMockMvc;

    private CheckerGroup checkerGroup;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CheckerGroup createEntity(EntityManager em) {
        CheckerGroup checkerGroup = new CheckerGroup()
            .name(DEFAULT_NAME)
            .status(DEFAULT_STATUS)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .updateBy(DEFAULT_UPDATE_BY);
        return checkerGroup;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CheckerGroup createUpdatedEntity(EntityManager em) {
        CheckerGroup checkerGroup = new CheckerGroup()
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);
        return checkerGroup;
    }

    @BeforeEach
    public void initTest() {
        checkerGroup = createEntity(em);
    }

    @Test
    @Transactional
    void createCheckerGroup() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the CheckerGroup
        var returnedCheckerGroup = om.readValue(
            restCheckerGroupMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(checkerGroup))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            CheckerGroup.class
        );

        // Validate the CheckerGroup in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCheckerGroupUpdatableFieldsEquals(returnedCheckerGroup, getPersistedCheckerGroup(returnedCheckerGroup));
    }

    @Test
    @Transactional
    void createCheckerGroupWithExistingId() throws Exception {
        // Create the CheckerGroup with an existing ID
        checkerGroup.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCheckerGroupMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(checkerGroup)))
            .andExpect(status().isBadRequest());

        // Validate the CheckerGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCheckerGroups() throws Exception {
        // Initialize the database
        checkerGroupRepository.saveAndFlush(checkerGroup);

        // Get all the checkerGroupList
        restCheckerGroupMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(checkerGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)));
    }

    @Test
    @Transactional
    void getCheckerGroup() throws Exception {
        // Initialize the database
        checkerGroupRepository.saveAndFlush(checkerGroup);

        // Get the checkerGroup
        restCheckerGroupMockMvc
            .perform(get(ENTITY_API_URL_ID, checkerGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(checkerGroup.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY));
    }

    @Test
    @Transactional
    void getNonExistingCheckerGroup() throws Exception {
        // Get the checkerGroup
        restCheckerGroupMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCheckerGroup() throws Exception {
        // Initialize the database
        checkerGroupRepository.saveAndFlush(checkerGroup);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the checkerGroup
        CheckerGroup updatedCheckerGroup = checkerGroupRepository.findById(checkerGroup.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCheckerGroup are not directly saved in db
        em.detach(updatedCheckerGroup);
        updatedCheckerGroup
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restCheckerGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCheckerGroup.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCheckerGroup))
            )
            .andExpect(status().isOk());

        // Validate the CheckerGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCheckerGroupToMatchAllProperties(updatedCheckerGroup);
    }

    @Test
    @Transactional
    void putNonExistingCheckerGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkerGroup.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCheckerGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, checkerGroup.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(checkerGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckerGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCheckerGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkerGroup.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckerGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(checkerGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckerGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCheckerGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkerGroup.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckerGroupMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(checkerGroup)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CheckerGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCheckerGroupWithPatch() throws Exception {
        // Initialize the database
        checkerGroupRepository.saveAndFlush(checkerGroup);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the checkerGroup using partial update
        CheckerGroup partialUpdatedCheckerGroup = new CheckerGroup();
        partialUpdatedCheckerGroup.setId(checkerGroup.getId());

        partialUpdatedCheckerGroup.name(UPDATED_NAME).status(UPDATED_STATUS).createdAt(UPDATED_CREATED_AT);

        restCheckerGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCheckerGroup.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCheckerGroup))
            )
            .andExpect(status().isOk());

        // Validate the CheckerGroup in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCheckerGroupUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedCheckerGroup, checkerGroup),
            getPersistedCheckerGroup(checkerGroup)
        );
    }

    @Test
    @Transactional
    void fullUpdateCheckerGroupWithPatch() throws Exception {
        // Initialize the database
        checkerGroupRepository.saveAndFlush(checkerGroup);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the checkerGroup using partial update
        CheckerGroup partialUpdatedCheckerGroup = new CheckerGroup();
        partialUpdatedCheckerGroup.setId(checkerGroup.getId());

        partialUpdatedCheckerGroup
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .updateBy(UPDATED_UPDATE_BY);

        restCheckerGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCheckerGroup.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCheckerGroup))
            )
            .andExpect(status().isOk());

        // Validate the CheckerGroup in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCheckerGroupUpdatableFieldsEquals(partialUpdatedCheckerGroup, getPersistedCheckerGroup(partialUpdatedCheckerGroup));
    }

    @Test
    @Transactional
    void patchNonExistingCheckerGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkerGroup.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCheckerGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, checkerGroup.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(checkerGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckerGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCheckerGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkerGroup.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckerGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(checkerGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckerGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCheckerGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkerGroup.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckerGroupMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(checkerGroup))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CheckerGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCheckerGroup() throws Exception {
        // Initialize the database
        checkerGroupRepository.saveAndFlush(checkerGroup);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the checkerGroup
        restCheckerGroupMockMvc
            .perform(delete(ENTITY_API_URL_ID, checkerGroup.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return checkerGroupRepository.count();
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

    protected CheckerGroup getPersistedCheckerGroup(CheckerGroup checkerGroup) {
        return checkerGroupRepository.findById(checkerGroup.getId()).orElseThrow();
    }

    protected void assertPersistedCheckerGroupToMatchAllProperties(CheckerGroup expectedCheckerGroup) {
        assertCheckerGroupAllPropertiesEquals(expectedCheckerGroup, getPersistedCheckerGroup(expectedCheckerGroup));
    }

    protected void assertPersistedCheckerGroupToMatchUpdatableProperties(CheckerGroup expectedCheckerGroup) {
        assertCheckerGroupAllUpdatablePropertiesEquals(expectedCheckerGroup, getPersistedCheckerGroup(expectedCheckerGroup));
    }
}
