package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Report;
import com.mycompany.myapp.service.dto.PlanStatisticalResponse;
import com.mycompany.myapp.service.dto.ReportResponse;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Report entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    public List<Report> findAllByPlanId(Long planId);

    @Query(value = "" + "select * from `report` where plan_id is null ;", nativeQuery = true)
    public List<Report> getAllWherePlanIdIsNull();

    public List<Report> findByPlanId(Long planId);

    @Query(
        value = "" +
        "WITH temp_table AS (\n" +
        "    SELECT \n" +
        " distinct(a.plan_group_history_id)\n" +
        "\t ,a.report_id AS report_id\n" +
        "\t ,c.id  AS plan_id\n" +
        "    FROM iso.plan_group_history_detail a\n" +
        "    INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id\n" +
        "    INNER JOIN iso.plan c ON c.id = b.plan_id WHERE c.id = ?1\n" +
        "),\n" +
        "\ttemp_table_2 AS (\n" +
        " SELECT \n" +
        "\t a.report_id AS report_id\n" +
        "\t ,a.plan_group_history_id\n" +
        "\t ,c.id  AS plan_id\n" +
        "\t ,a.result\n" +
        "    FROM iso.plan_group_history_detail a\n" +
        "    INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id\n" +
        "    INNER JOIN iso.plan c ON c.id = b.plan_id WHERE c.id = ?1\n" +
        ")\n" +
        "SELECT \n" +
        "distinct(pghd.plan_group_history_id) AS planGroupHistoryId\n" +
        ",pgh.name AS planGroupHistoryName\n" +
        ",pgh.code AS planGroupHistoryCode\n" +
        ",pgh.check_date AS checkDate\n" +
        ",rp.score_scale AS scoreScale\n" +
        " ,(SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.plan_group_history_id = pghd.plan_group_history_id AND rp.id = report_id AND result ='NC') AS sumOfNc\n" +
        " ,(SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.plan_group_history_id = pghd.plan_group_history_id AND rp.id = report_id AND result ='LY') AS sumOfLy\n" +
        " ,(SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.plan_group_history_id = pghd.plan_group_history_id AND rp.id = report_id AND result ='Không đạt') AS sumOfFail\n" +
        "FROM iso.plan_group_history_detail pghd\n" +
        "INNER JOIN iso.plan_group_history pgh ON pghd.plan_group_history_id = pgh.id\n" +
        "INNER JOIN iso.report rp ON rp.id = pghd.report_id WHERE rp.id = ?2 ;",
        nativeQuery = true
    )
    public List<PlanStatisticalResponse> getAllStatisticalByReportId(Long planId, Long reportId);

    @Query(
        value = "" +
        "WITH temp_table AS (\n" +
        "    SELECT \n" +
        "        distinct(a.plan_group_history_id)\n" +
        "        ,a.report_id AS report_id\n" +
        "        ,c.id AS plan_id\n" +
        "    FROM iso.plan_group_history_detail a\n" +
        "    LEFT JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id\n" +
        "    LEFT JOIN iso.plan c ON c.id = b.plan_id WHERE c.id = ?1 \n" +
        "),\n" +
        "temp_table_2 AS (\n" +
        "    SELECT \n" +
        "        a.report_id AS report_id\n" +
        "        ,a.plan_group_history_id\n" +
        "        ,c.id AS plan_id\n" +
        "        ,a.result\n" +
        "    FROM iso.plan_group_history_detail a\n" +
        "    LEFT JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id\n" +
        "    LEFT JOIN iso.plan c ON c.id = b.plan_id WHERE c.id = ?1 \n" +
        ")\n" +
        "SELECT \n" +
        "    distinct(rp.id) as reportId\n" +
        "    ,rp.id as id\n" +
        "    ,rp.name as name\n" +
        "    ,rp.code as code\n" +
        "    ,rp.sample_report_id AS sampleReportId \n" +
        "    ,rp.test_of_object AS testOfObject\n" +
        "    ,rp.checker AS checker\n" +
        "    ,rp.status AS status\n" +
        "    ,rp.frequency AS frequency\n" +
        "    ,rp.report_type AS reportType\n" +
        "    ,rp.report_type_id AS reportTypeId\n" +
        "    ,rp.group_report AS groupReport\n" +
        "    ,rp.created_at AS createdAt\n" +
        "    ,rp.updated_at AS updatedAt\n" +
        "    ,rp.check_time AS checkTime\n" +
        "    ,rp.update_by AS updateBy\n" +
        "    ,rp.plan_id AS planId\n" +
        "    ,rp.detail AS detail\n" +
        "    ,rp.user AS user\n" +
        "    ,COALESCE((SELECT COUNT(*) FROM temp_table tb WHERE tb.report_id = rp.id), 0) AS sumOfAudit\n" +
        "    ,rp.convert_score as convertScore\n" +
        "    ,rp.score_scale as scoreScale\n" +
        "    ,COALESCE((SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id AND result ='NC'), 0) AS sumOfNc\n" +
        "    ,COALESCE((SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id AND result ='LY'), 0) AS sumOfLy\n" +
        "    ,COALESCE((SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id AND result ='Không đạt'), 0) AS sumOfFail\n" +
        "FROM iso.report rp\n" +
        "INNER JOIN iso.plan p ON p.id = rp.plan_id \n" +
        "LEFT JOIN plan_group_history_detail pghd ON rp.id = pghd.report_id " +
        "WHERE p.id = ?1 ;",
        nativeQuery = true
    )
    public List<ReportResponse> getDetailByPlanId(Long planId);
}
