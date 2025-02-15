package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.TitleAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Title;
import com.mycompany.myapp.repository.TitleRepository;
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
 * Integration tests for the {@link TitleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TitleResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SOURCE = "AAAAAAAAAA";
    private static final String UPDATED_SOURCE = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_DATA_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_DATA_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_UPDATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_BY = "BBBBBBBBBB";

    private static final String DEFAULT_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/titles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TitleRepository titleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTitleMockMvc;

    private Title title;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Title createEntity(EntityManager em) {
        Title title = new Title()
            .name(DEFAULT_NAME)
            .source(DEFAULT_SOURCE)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .dataType(DEFAULT_DATA_TYPE)
            .updateBy(DEFAULT_UPDATE_BY)
            .field(DEFAULT_FIELD);
        return title;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Title createUpdatedEntity(EntityManager em) {
        Title title = new Title()
            .name(UPDATED_NAME)
            .source(UPDATED_SOURCE)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .dataType(UPDATED_DATA_TYPE)
            .updateBy(UPDATED_UPDATE_BY)
            .field(UPDATED_FIELD);
        return title;
    }

    @BeforeEach
    public void initTest() {
        title = createEntity(em);
    }

    @Test
    @Transactional
    void createTitle() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Title
        var returnedTitle = om.readValue(
            restTitleMockMvc
                .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(title)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Title.class
        );

        // Validate the Title in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTitleUpdatableFieldsEquals(returnedTitle, getPersistedTitle(returnedTitle));
    }

    @Test
    @Transactional
    void createTitleWithExistingId() throws Exception {
        // Create the Title with an existing ID
        title.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTitleMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(title)))
            .andExpect(status().isBadRequest());

        // Validate the Title in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTitles() throws Exception {
        // Initialize the database
        titleRepository.saveAndFlush(title);

        // Get all the titleList
        restTitleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(title.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].source").value(hasItem(DEFAULT_SOURCE)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].dataType").value(hasItem(DEFAULT_DATA_TYPE)))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)))
            .andExpect(jsonPath("$.[*].field").value(hasItem(DEFAULT_FIELD)));
    }

    @Test
    @Transactional
    void getTitle() throws Exception {
        // Initialize the database
        titleRepository.saveAndFlush(title);

        // Get the title
        restTitleMockMvc
            .perform(get(ENTITY_API_URL_ID, title.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(title.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.source").value(DEFAULT_SOURCE))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.dataType").value(DEFAULT_DATA_TYPE))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY))
            .andExpect(jsonPath("$.field").value(DEFAULT_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingTitle() throws Exception {
        // Get the title
        restTitleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTitle() throws Exception {
        // Initialize the database
        titleRepository.saveAndFlush(title);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the title
        Title updatedTitle = titleRepository.findById(title.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTitle are not directly saved in db
        em.detach(updatedTitle);
        updatedTitle
            .name(UPDATED_NAME)
            .source(UPDATED_SOURCE)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .dataType(UPDATED_DATA_TYPE)
            .updateBy(UPDATED_UPDATE_BY)
            .field(UPDATED_FIELD);

        restTitleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTitle.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTitle))
            )
            .andExpect(status().isOk());

        // Validate the Title in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTitleToMatchAllProperties(updatedTitle);
    }

    @Test
    @Transactional
    void putNonExistingTitle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        title.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTitleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, title.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(title))
            )
            .andExpect(status().isBadRequest());

        // Validate the Title in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTitle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        title.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTitleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(title))
            )
            .andExpect(status().isBadRequest());

        // Validate the Title in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTitle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        title.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTitleMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(title)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Title in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTitleWithPatch() throws Exception {
        // Initialize the database
        titleRepository.saveAndFlush(title);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the title using partial update
        Title partialUpdatedTitle = new Title();
        partialUpdatedTitle.setId(title.getId());

        partialUpdatedTitle.name(UPDATED_NAME).source(UPDATED_SOURCE).dataType(UPDATED_DATA_TYPE).field(UPDATED_FIELD);

        restTitleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTitle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTitle))
            )
            .andExpect(status().isOk());

        // Validate the Title in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTitleUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedTitle, title), getPersistedTitle(title));
    }

    @Test
    @Transactional
    void fullUpdateTitleWithPatch() throws Exception {
        // Initialize the database
        titleRepository.saveAndFlush(title);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the title using partial update
        Title partialUpdatedTitle = new Title();
        partialUpdatedTitle.setId(title.getId());

        partialUpdatedTitle
            .name(UPDATED_NAME)
            .source(UPDATED_SOURCE)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .dataType(UPDATED_DATA_TYPE)
            .updateBy(UPDATED_UPDATE_BY)
            .field(UPDATED_FIELD);

        restTitleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTitle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTitle))
            )
            .andExpect(status().isOk());

        // Validate the Title in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTitleUpdatableFieldsEquals(partialUpdatedTitle, getPersistedTitle(partialUpdatedTitle));
    }

    @Test
    @Transactional
    void patchNonExistingTitle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        title.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTitleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, title.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(title))
            )
            .andExpect(status().isBadRequest());

        // Validate the Title in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTitle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        title.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTitleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(title))
            )
            .andExpect(status().isBadRequest());

        // Validate the Title in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTitle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        title.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTitleMockMvc
            .perform(patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(title)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Title in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTitle() throws Exception {
        // Initialize the database
        titleRepository.saveAndFlush(title);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the title
        restTitleMockMvc
            .perform(delete(ENTITY_API_URL_ID, title.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return titleRepository.count();
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

    protected Title getPersistedTitle(Title title) {
        return titleRepository.findById(title.getId()).orElseThrow();
    }

    protected void assertPersistedTitleToMatchAllProperties(Title expectedTitle) {
        assertTitleAllPropertiesEquals(expectedTitle, getPersistedTitle(expectedTitle));
    }

    protected void assertPersistedTitleToMatchUpdatableProperties(Title expectedTitle) {
        assertTitleAllUpdatablePropertiesEquals(expectedTitle, getPersistedTitle(expectedTitle));
    }
}
