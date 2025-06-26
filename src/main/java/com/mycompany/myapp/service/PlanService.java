package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Plan;
import com.mycompany.myapp.domain.PlanAutoUpdateResponse;
import com.mycompany.myapp.domain.Report;
import com.mycompany.myapp.repository.PlanRepository;
import com.mycompany.myapp.repository.ReportRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class PlanService {

    @Autowired
    PlanRepository planRepository;

    @Autowired
    ReportRepository reportRepository;

    @Scheduled(cron = "0 0 1-23 * * *", zone = "Asia/Bangkok")
    public void runHourlyFrom1To23h() {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("'%'yyyy-MM-dd'%'");
        String formattedDate = today.format(formatter);

        // Kiểm tra xem hiện tại có phải 23h không
        LocalTime now = LocalTime.now(ZoneId.of("Asia/Bangkok"));
        if (now.getHour() == 17) {
            System.out.println("UPDATE REPORT AT END OF DAY:: " + now.getHour());
        } else {
            System.out.println("UPDATE REPORT AT :: " + formattedDate + " :: " + now.getHour());
        }

        List<Plan> planList = this.planRepository.getPlanByTimeEnd(formattedDate);
        if (planList != null) {
            for (Plan plan : planList) {
                boolean checked = true;
                List<PlanAutoUpdateResponse> results = this.planRepository.getReportStatusByPlanId(plan.getId());

                for (PlanAutoUpdateResponse result : results) {
                    System.out.println("UPDATE REPORT ID :: " + result.getId());
                    Report report = this.reportRepository.findById(result.getId()).orElse(null);
                    if (report != null) {
                        report.setStatus(result.getStatus());
                        this.reportRepository.save(report);
                    }

                    if ("Chưa hoàn thành".equals(result.getStatus())) {
                        checked = false;
                    }
                }

                if (!checked) {
                    if (now.getHour() != 17) {
                        plan.setStatus("Đang thực hiện");
                    } else {
                        plan.setStatus("Chưa hoàn thành");
                    }
                } else {
                    if (now.getHour() != 17) {
                        plan.setStatus("Đang thực hiện");
                    } else {
                        plan.setStatus("Đã hoàn thành");
                    }
                }
                System.out.println("REPORT STATUS AT :: " + formattedDate + " :: " + now.getHour() + " IS :: " + plan.getStatus());
                this.planRepository.save(plan);
            }
        }
    }
}
