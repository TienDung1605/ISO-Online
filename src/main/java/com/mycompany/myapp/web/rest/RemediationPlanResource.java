package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.RecheckRemediationPlanDetail;
import com.mycompany.myapp.domain.RemediationPlan;
import com.mycompany.myapp.domain.RemediationPlanDetail;
import com.mycompany.myapp.repository.RecheckRemediationPlanDetailRepository;
import com.mycompany.myapp.repository.RemediationPlanDetailRepository;
import com.mycompany.myapp.repository.RemediationPlanRepository;
import com.mycompany.myapp.service.dto.RecheckRemediationPlanDetailDTO;
import com.mycompany.myapp.service.dto.RemediationPlanDetailDTO;
import com.mycompany.myapp.service.dto.RemediationPlanResponseDTO;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tech.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api/remediation-plan")
@Transactional
public class RemediationPlanResource {

    private final Logger log = LoggerFactory.getLogger(RemediationPlanResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String ENTITY_NAME = "remediationPlan";

    @Autowired
    private RemediationPlanRepository remediationPlanRepository;

    @Autowired
    private RemediationPlanDetailRepository remediationPlanDetailRepository;

    @Autowired
    private RecheckRemediationPlanDetailRepository recheckRemediationPlanDetailRepository;

    @GetMapping("")
    public List<RemediationPlan> getAllRemediationPlan() {
        return remediationPlanRepository.findAll();
    }

    //    Lấy list danh sách theo reportId
    @GetMapping("/{id}")
    public List<RemediationPlan> getAllByReportId(@PathVariable Long id) {
        return this.remediationPlanRepository.findAllByReportId(id);
    }

    @GetMapping("/plan-id/{id}")
    public List<RemediationPlan> getAllByPlanId(@PathVariable Long id) {
        return this.remediationPlanRepository.findAllByPlanId(id);
    }

    @PostMapping("")
    public ResponseEntity<?> createData(@RequestBody RemediationPlan newData) {
        try {
            this.remediationPlanRepository.save(newData);
            return ResponseEntity.status(HttpStatus.CREATED).body(newData.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRemediationPlan(@PathVariable("id") Long id) {
        log.debug("REST request to delete Plan : {}", id);
        remediationPlanRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/get-all/{planId}/{reportId}")
    public List<RemediationPlan> getAllByPlanIdAndReportId(@PathVariable Long planId, @PathVariable Long reportId) {
        return remediationPlanRepository.findAllByPlanIdAndReportId(planId, reportId);
    }

    @GetMapping("/remediation-plans/{id}/details")
    public ResponseEntity<RemediationPlanResponseDTO> getRemediationPlanDetailsById(@PathVariable Long id) {
        log.debug("REST request to get RemediationPlan details and rechecks for id : {}", id);

        // 1. Lấy RemediationPlan gốc
        RemediationPlan remediationPlan = remediationPlanRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "RemediationPlan not found with id = " + id));

        // 2. Lấy tất cả RemediationPlanDetail liên quan đến RemediationPlan này
        List<RemediationPlanDetail> remediationPlanDetails = remediationPlanDetailRepository.findByRemediationPlanId(
            remediationPlan.getId()
        );

        // 3. Lấy tất cả RemediationPlanDetail ID để truy vấn RecheckRemediationPlanDetail
        List<Long> detailIds = remediationPlanDetails.stream().map(RemediationPlanDetail::getId).collect(Collectors.toList());

        // 4. Lấy tất cả RecheckRemediationPlanDetail liên quan đến các RemediationPlanDetail
        List<RecheckRemediationPlanDetail> allRechecks = List.of();
        if (!detailIds.isEmpty()) {
            allRechecks = recheckRemediationPlanDetailRepository.findByRemediationPlanDetailIdIn(detailIds);
        }

        // 5. Gom RecheckRemediationPlanDetail vào Map để dễ dàng tra cứu
        Map<Long, List<RecheckRemediationPlanDetail>> rechecksByDetailId = allRechecks
            .stream()
            .collect(Collectors.groupingBy(RecheckRemediationPlanDetail::getRemediationPlanDetailId));

        // 6. Chuyển đổi và gom dữ liệu vào DTOs
        RemediationPlanResponseDTO responseDto = new RemediationPlanResponseDTO();
        // Ánh xạ các trường từ RemediationPlan Entity sang DTO
        responseDto.setId(remediationPlan.getId());
        responseDto.setCode(remediationPlan.getCode());
        responseDto.setName(remediationPlan.getName());
        responseDto.setReportId(remediationPlan.getReportId());
        responseDto.setPlanId(remediationPlan.getPlanId());
        responseDto.setRepairDate(remediationPlan.getRepairDate());
        responseDto.setCreatedAt(remediationPlan.getCreatedAt());
        responseDto.setUpdatedAt(remediationPlan.getUpdatedAt());
        responseDto.setCreatedBy(remediationPlan.getCreatedBy());
        responseDto.setType(remediationPlan.getType());
        responseDto.setStatus(remediationPlan.getStatus());

        List<RemediationPlanDetailDTO> detailDTOs = remediationPlanDetails
            .stream()
            .map(detail -> {
                RemediationPlanDetailDTO detailDto = new RemediationPlanDetailDTO();
                // Ánh xạ các trường từ RemediationPlanDetail Entity sang DTO
                detailDto.setId(detail.getId());
                detailDto.setRemediationPlanId(detail.getRemediationPlanId());
                detailDto.setCriterialName(detail.getCriterialName());
                detailDto.setCriterialGroupName(detail.getCriterialGroupName());
                detailDto.setConvertScore(detail.getConvertScore());
                detailDto.setNote(detail.getNote());
                detailDto.setSolution(detail.getSolution());
                detailDto.setStatus(detail.getStatus());
                detailDto.setPlanTimeComplete(detail.getPlanTimeComplete());

                // --- PHẦN SỬA LỖI ---
                // Nếu trường 'detail' trong RemediationPlanDetail Entity là String và bạn muốn giữ nó:
                detailDto.setDetail(detail.getDetail()); // Giữ nguyên trường String detail từ entity

                // Nếu bạn muốn bỏ qua trường 'detail' String và chỉ dùng 'recheckDetails' List,
                // thì hãy xóa dòng trên và đảm bảo DTO của bạn không còn trường 'detail' String.

                detailDto.setUserHandle(detail.getUserHandle());
                detailDto.setCreatedAt(detail.getCreatedAt());
                detailDto.setUpdatedAt(detail.getUpdatedAt());
                detailDto.setCreatedBy(detail.getCreatedBy());

                // Gom RecheckRemediationPlanDetail vào trường 'recheckDetails' của DTO
                List<RecheckRemediationPlanDetail> rechecksForDetail = rechecksByDetailId.getOrDefault(detail.getId(), List.of());
                List<RecheckRemediationPlanDetailDTO> recheckDTOs = rechecksForDetail
                    .stream()
                    .map(recheck -> {
                        RecheckRemediationPlanDetailDTO recheckDto = new RecheckRemediationPlanDetailDTO();
                        // Ánh xạ các trường từ RecheckRemediationPlanDetail Entity sang DTO
                        recheckDto.setId(recheck.getId());
                        recheckDto.setResult(recheck.getResult());
                        recheckDto.setImage(recheck.getImage());
                        recheckDto.setReason(recheck.getReason());
                        recheckDto.setNote(recheck.getNote());
                        recheckDto.setCreatedBy(recheck.getCreatedBy());
                        recheckDto.setCreatedAt(recheck.getCreatedAt());
                        recheckDto.setStatus(recheck.getStatus());
                        // Cần thêm trường RemediationPlanDetailId vào RecheckRemediationPlanDetailDTO nếu nó có và bạn cần
                        // recheckDto.setRemediationPlanDetailId(recheck.getRemediationPlanDetailId());
                        return recheckDto;
                    })
                    .collect(Collectors.toList());

                // ĐẶT List<RecheckRemediationPlanDetailDTO> vào trường 'recheckDetails' của DTO
                detailDto.setRecheckDetails(recheckDTOs); // <--- SỬA Ở ĐÂY
                // KHÔNG ĐẶT recheckDTOs vào detailDto.setDetail() nữa
                // KHÔNG GỌI detail.getRecheckDetails() nếu entity không có phương thức đó

                return detailDto;
            })
            .collect(Collectors.toList());

        responseDto.setDetails(detailDTOs);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
