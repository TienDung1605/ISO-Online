package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ScriptAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Script;
import com.mycompany.myapp.repository.ScriptRepository;
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
 * Integration tests for the {@link ScriptResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ScriptResourceIT {

    private static final String DEFAULT_SCRIPT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_SCRIPT_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_SCRIPT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SCRIPT_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_TIME_START = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME_START = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_TIME_END = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME_END = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_UPDATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_BY = "BBBBBBBBBB";

    private static final String DEFAULT_FREQUENCY = "AAAAAAAAAA";
    private static final String UPDATED_FREQUENCY = "BBBBBBBBBB";

    private static final String DEFAULT_SUBJECT_OF_ASSETMENT_PLAN = "AAAAAAAAAA";
    private static final String UPDATED_SUBJECT_OF_ASSETMENT_PLAN = "BBBBBBBBBB";

    private static final String DEFAULT_CODE_PLAN = "AAAAAAAAAA";
    private static final String UPDATED_CODE_PLAN = "BBBBBBBBBB";

    private static final String DEFAULT_NAME_PLAN = "AAAAAAAAAA";
    private static final String UPDATED_NAME_PLAN = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_TIME_CHECK = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME_CHECK = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_PARTICIPANT = "AAAAAAAAAA";
    private static final String UPDATED_PARTICIPANT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/scripts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ScriptRepository scriptRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restScriptMockMvc;

    private Script script;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Script createEntity(EntityManager em) {
        Script script = new Script()
            .scriptCode(DEFAULT_SCRIPT_CODE)
            .scriptName(DEFAULT_SCRIPT_NAME)
            .timeStart(DEFAULT_TIME_START)
            .timeEnd(DEFAULT_TIME_END)
            .status(DEFAULT_STATUS)
            .updateBy(DEFAULT_UPDATE_BY)
            .frequency(DEFAULT_FREQUENCY)
            .subjectOfAssetmentPlan(DEFAULT_SUBJECT_OF_ASSETMENT_PLAN)
            .codePlan(DEFAULT_CODE_PLAN)
            .namePlan(DEFAULT_NAME_PLAN)
            .timeCheck(DEFAULT_TIME_CHECK)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .participant(DEFAULT_PARTICIPANT);
        return script;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Script createUpdatedEntity(EntityManager em) {
        Script script = new Script()
            .scriptCode(UPDATED_SCRIPT_CODE)
            .scriptName(UPDATED_SCRIPT_NAME)
            .timeStart(UPDATED_TIME_START)
            .timeEnd(UPDATED_TIME_END)
            .status(UPDATED_STATUS)
            .updateBy(UPDATED_UPDATE_BY)
            .frequency(UPDATED_FREQUENCY)
            .subjectOfAssetmentPlan(UPDATED_SUBJECT_OF_ASSETMENT_PLAN)
            .codePlan(UPDATED_CODE_PLAN)
            .namePlan(UPDATED_NAME_PLAN)
            .timeCheck(UPDATED_TIME_CHECK)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .participant(UPDATED_PARTICIPANT);
        return script;
    }

    @BeforeEach
    public void initTest() {
        script = createEntity(em);
    }

    @Test
    @Transactional
    void createScript() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Script
        var returnedScript = om.readValue(
            restScriptMockMvc
                .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(script)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Script.class
        );

        // Validate the Script in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertScriptUpdatableFieldsEquals(returnedScript, getPersistedScript(returnedScript));
    }

    @Test
    @Transactional
    void createScriptWithExistingId() throws Exception {
        // Create the Script with an existing ID
        script.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restScriptMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(script)))
            .andExpect(status().isBadRequest());

        // Validate the Script in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllScripts() throws Exception {
        // Initialize the database
        scriptRepository.saveAndFlush(script);

        // Get all the scriptList
        restScriptMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(script.getId().intValue())))
            .andExpect(jsonPath("$.[*].scriptCode").value(hasItem(DEFAULT_SCRIPT_CODE)))
            .andExpect(jsonPath("$.[*].scriptName").value(hasItem(DEFAULT_SCRIPT_NAME)))
            .andExpect(jsonPath("$.[*].timeStart").value(hasItem(sameInstant(DEFAULT_TIME_START))))
            .andExpect(jsonPath("$.[*].timeEnd").value(hasItem(sameInstant(DEFAULT_TIME_END))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].updateBy").value(hasItem(DEFAULT_UPDATE_BY)))
            .andExpect(jsonPath("$.[*].frequency").value(hasItem(DEFAULT_FREQUENCY)))
            .andExpect(jsonPath("$.[*].subjectOfAssetmentPlan").value(hasItem(DEFAULT_SUBJECT_OF_ASSETMENT_PLAN)))
            .andExpect(jsonPath("$.[*].codePlan").value(hasItem(DEFAULT_CODE_PLAN)))
            .andExpect(jsonPath("$.[*].namePlan").value(hasItem(DEFAULT_NAME_PLAN)))
            .andExpect(jsonPath("$.[*].timeCheck").value(hasItem(sameInstant(DEFAULT_TIME_CHECK))))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].participant").value(hasItem(DEFAULT_PARTICIPANT)));
    }

    @Test
    @Transactional
    void getScript() throws Exception {
        // Initialize the database
        scriptRepository.saveAndFlush(script);

        // Get the script
        restScriptMockMvc
            .perform(get(ENTITY_API_URL_ID, script.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(script.getId().intValue()))
            .andExpect(jsonPath("$.scriptCode").value(DEFAULT_SCRIPT_CODE))
            .andExpect(jsonPath("$.scriptName").value(DEFAULT_SCRIPT_NAME))
            .andExpect(jsonPath("$.timeStart").value(sameInstant(DEFAULT_TIME_START)))
            .andExpect(jsonPath("$.timeEnd").value(sameInstant(DEFAULT_TIME_END)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.updateBy").value(DEFAULT_UPDATE_BY))
            .andExpect(jsonPath("$.frequency").value(DEFAULT_FREQUENCY))
            .andExpect(jsonPath("$.subjectOfAssetmentPlan").value(DEFAULT_SUBJECT_OF_ASSETMENT_PLAN))
            .andExpect(jsonPath("$.codePlan").value(DEFAULT_CODE_PLAN))
            .andExpect(jsonPath("$.namePlan").value(DEFAULT_NAME_PLAN))
            .andExpect(jsonPath("$.timeCheck").value(sameInstant(DEFAULT_TIME_CHECK)))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.participant").value(DEFAULT_PARTICIPANT));
    }

    @Test
    @Transactional
    void getNonExistingScript() throws Exception {
        // Get the script
        restScriptMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingScript() throws Exception {
        // Initialize the database
        scriptRepository.saveAndFlush(script);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the script
        Script updatedScript = scriptRepository.findById(script.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedScript are not directly saved in db
        em.detach(updatedScript);
        updatedScript
            .scriptCode(UPDATED_SCRIPT_CODE)
            .scriptName(UPDATED_SCRIPT_NAME)
            .timeStart(UPDATED_TIME_START)
            .timeEnd(UPDATED_TIME_END)
            .status(UPDATED_STATUS)
            .updateBy(UPDATED_UPDATE_BY)
            .frequency(UPDATED_FREQUENCY)
            .subjectOfAssetmentPlan(UPDATED_SUBJECT_OF_ASSETMENT_PLAN)
            .codePlan(UPDATED_CODE_PLAN)
            .namePlan(UPDATED_NAME_PLAN)
            .timeCheck(UPDATED_TIME_CHECK)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .participant(UPDATED_PARTICIPANT);

        restScriptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedScript.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedScript))
            )
            .andExpect(status().isOk());

        // Validate the Script in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedScriptToMatchAllProperties(updatedScript);
    }

    @Test
    @Transactional
    void putNonExistingScript() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        script.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScriptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, script.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(script))
            )
            .andExpect(status().isBadRequest());

        // Validate the Script in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchScript() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        script.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScriptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(script))
            )
            .andExpect(status().isBadRequest());

        // Validate the Script in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamScript() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        script.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScriptMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(script)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Script in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateScriptWithPatch() throws Exception {
        // Initialize the database
        scriptRepository.saveAndFlush(script);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the script using partial update
        Script partialUpdatedScript = new Script();
        partialUpdatedScript.setId(script.getId());

        partialUpdatedScript
            .scriptCode(UPDATED_SCRIPT_CODE)
            .timeEnd(UPDATED_TIME_END)
            .frequency(UPDATED_FREQUENCY)
            .codePlan(UPDATED_CODE_PLAN)
            .namePlan(UPDATED_NAME_PLAN)
            .timeCheck(UPDATED_TIME_CHECK);

        restScriptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScript.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedScript))
            )
            .andExpect(status().isOk());

        // Validate the Script in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertScriptUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedScript, script), getPersistedScript(script));
    }

    @Test
    @Transactional
    void fullUpdateScriptWithPatch() throws Exception {
        // Initialize the database
        scriptRepository.saveAndFlush(script);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the script using partial update
        Script partialUpdatedScript = new Script();
        partialUpdatedScript.setId(script.getId());

        partialUpdatedScript
            .scriptCode(UPDATED_SCRIPT_CODE)
            .scriptName(UPDATED_SCRIPT_NAME)
            .timeStart(UPDATED_TIME_START)
            .timeEnd(UPDATED_TIME_END)
            .status(UPDATED_STATUS)
            .updateBy(UPDATED_UPDATE_BY)
            .frequency(UPDATED_FREQUENCY)
            .subjectOfAssetmentPlan(UPDATED_SUBJECT_OF_ASSETMENT_PLAN)
            .codePlan(UPDATED_CODE_PLAN)
            .namePlan(UPDATED_NAME_PLAN)
            .timeCheck(UPDATED_TIME_CHECK)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .participant(UPDATED_PARTICIPANT);

        restScriptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScript.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedScript))
            )
            .andExpect(status().isOk());

        // Validate the Script in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertScriptUpdatableFieldsEquals(partialUpdatedScript, getPersistedScript(partialUpdatedScript));
    }

    @Test
    @Transactional
    void patchNonExistingScript() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        script.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScriptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, script.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(script))
            )
            .andExpect(status().isBadRequest());

        // Validate the Script in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchScript() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        script.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScriptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(script))
            )
            .andExpect(status().isBadRequest());

        // Validate the Script in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamScript() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        script.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScriptMockMvc
            .perform(patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(script)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Script in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteScript() throws Exception {
        // Initialize the database
        scriptRepository.saveAndFlush(script);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the script
        restScriptMockMvc
            .perform(delete(ENTITY_API_URL_ID, script.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return scriptRepository.count();
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

    protected Script getPersistedScript(Script script) {
        return scriptRepository.findById(script.getId()).orElseThrow();
    }

    protected void assertPersistedScriptToMatchAllProperties(Script expectedScript) {
        assertScriptAllPropertiesEquals(expectedScript, getPersistedScript(expectedScript));
    }

    protected void assertPersistedScriptToMatchUpdatableProperties(Script expectedScript) {
        assertScriptAllUpdatablePropertiesEquals(expectedScript, getPersistedScript(expectedScript));
    }
}
