import { Component, NgZone, inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeNode } from 'primeng/api'; // Import TreeNode

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IPlan } from '../plan.model';
import { EntityArrayResponseType, PlanService } from '../service/plan.service';
import { PlanDeleteDialogComponent } from '../delete/plan-delete-dialog.component';
import { TreeTableModule } from 'primeng/treetable';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { SummarizePlanComponent } from 'app/entities/summarize-plan/summarize-plan.component';
import { TagModule } from 'primeng/tag';

interface CheckPlanDetail {
  id: number;
  score: number;
  reportName: string;
  checkDate: string;
  nc: number;
  ly: number;
  notPass: number;
}

interface CriteriaSummary {
  id: number;
  criteriaGroup: string;
  criteriaName: string;
  conclusion: string;
  evaluationContent: string;
  evaluationImage: string;
  status: 'Đạt' | 'Không đạt' | 'Chờ đánh giá';
}

@Component({
  standalone: true,
  selector: 'jhi-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['../../shared.component.css'],
  // animations: [
  //   trigger('overlayContentAnimation', [
  //     state('void', style({
  //       transform: 'translateY(5%)',
  //       opacity: 0
  //     })),
  //     state('visible', style({
  //       transform: 'translateY(0)',
  //       opacity: 1
  //     })),
  //     transition('void => visible', animate('225ms ease-out')),
  //     transition('visible => void', animate('195ms ease-in'))
  //   ])
  // ],
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    FormatMediumDatetimePipe,
    TreeTableModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    NgbModule,
    DialogModule,
    TagModule,
    // BrowserAnimationsModule,
    // CommonModule
  ],
  providers: [
    SummarizePlanComponent, // Add this
  ],
})
export class PlanComponent implements OnInit {
  subscription: Subscription | null = null;
  plans?: IPlan[];
  isLoading = false;
  treeNodes!: TreeNode[];
  columnDefinitions?: IPlan[];
  sortState = sortStateSignal({});
  files?: TreeNode[];
  expandedRows: { [key: string]: boolean } = {};
  @ViewChild('dt2') dt2!: any;
  planDetailResults: any[] = [];
  sampleReportName: any[] = [];
  // userTesting: any;
  @ViewChild('userTesting') userTesting!: TemplateRef<any>;
  @ViewChild('gross') gross!: TemplateRef<any>;
  @ViewChild('criteria') criteria!: TemplateRef<any>;
  @ViewChild('evaluationResult') evaluationResult!: TemplateRef<any>;
  @ViewChild('inspectionData') inspectionData!: TemplateRef<any>;
  @ViewChild('detailInspectionData') detailInspectionData!: TemplateRef<any>;
  @ViewChild('criteriaConclusion') criteriaConclusion!: TemplateRef<any>;
  @ViewChild('evaluationPlan') evaluationPlan!: TemplateRef<any>;
  planData = [
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5,
      orders: [
        {
          id: '1000-0',
          productCode: 'f230fh0g3',
          date: '2020-09-13',
          amount: 65,
          quantity: 1,
          customer: 'David James',
          status: 'PENDING',
        },
        {
          id: '1000-1',
          productCode: 'f230fh0g3',
          date: '2020-05-14',
          amount: 130,
          quantity: 2,
          customer: 'Leon Rodrigues',
          status: 'DELIVERED',
        },
        {
          id: '1000-2',
          productCode: 'f230fh0g3',
          date: '2019-01-04',
          amount: 65,
          quantity: 1,
          customer: 'Juan Alejandro',
          status: 'RETURNED',
        },
        {
          id: '1000-3',
          productCode: 'f230fh0g3',
          date: '2020-09-13',
          amount: 195,
          quantity: 3,
          customer: 'Claire Morrow',
          status: 'CANCELLED',
        },
      ],
    },
  ];

  planDetails = [
    {
      id: 1,
      level: 'Cấp 1',
      checkTarget: 'Đối tượng 1',
      reportType: 'Loại 1',
      reportTemplate: 'Mẫu 1',
      reportCode: 'BBKT001',
      reportGroup: 'Nhóm 1',
      frequency: 'Hàng ngày',
      scoreScale: '10',
    },
    {
      id: 2,
      level: 'Cấp 2',
      checkTarget: 'Đối tượng 2',
      reportType: 'Loại 2',
      reportTemplate: 'Mẫu 2',
      reportCode: 'BBKT002',
      reportGroup: 'Nhóm 2',
      frequency: 'Hàng tuần',
      scoreScale: '10',
    },
    {
      id: 3,
      level: 'Cấp 2',
      checkTarget: 'Đối tượng 3',
      reportType: 'Loại 2',
      reportTemplate: 'Mẫu 2',
      reportCode: 'BBKT003',
      reportGroup: 'Nhóm 2',
      frequency: 'Hàng tháng',
      scoreScale: '10',
    },
  ];

  columnWidths = {
    'min-width': '960px',
    width: '100%',
  };

  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 },
  ];

  scriptEvaluations = [
    {
      id: 1,
      criteriaGroup: 'An toàn lao động',
      criteria: 'AT01 - Trang bị bảo hộ',
      frequency: 'Hàng ngày',
      evaluationResult: 'Đạt',
      evaluationContent: 'Đầy đủ trang bị',
      evaluationImage: 'at01.jpg',
    },
    {
      id: 2,
      criteriaGroup: 'An toàn lao động',
      criteria: 'AT02 - Thiết bị bảo vệ',
      frequency: 'Hàng tuần',
      evaluationResult: 'Đạt',
      evaluationContent: 'Hoạt động tốt',
      evaluationImage: 'at02.jpg',
    },
    {
      id: 3,
      criteriaGroup: '5S',
      criteria: '5S01 - Sàng lọc',
      frequency: 'Hàng ngày',
      evaluationResult: 'Không đạt',
      evaluationContent: 'Cần cải thiện',
      evaluationImage: '5s01.jpg',
    },
    {
      id: 4,
      criteriaGroup: '5S',
      criteria: '5S02 - Sắp xếp',
      frequency: 'Hàng tuần',
      evaluationResult: 'Đạt',
      evaluationContent: 'Ngăn nắp',
      evaluationImage: '5s02.jpg',
    },
    {
      id: 5,
      criteriaGroup: 'Quy trình sản xuất',
      criteria: 'QT01 - Kiểm soát',
      frequency: 'Hàng ngày',
      evaluationResult: 'Đạt',
      evaluationContent: 'Tuân thủ',
      evaluationImage: 'qt01.jpg',
    },
    {
      id: 6,
      criteriaGroup: 'Quy trình sản xuất',
      criteria: 'QT02 - Vận hành',
      frequency: 'Hàng tuần',
      evaluationResult: 'Đạt',
      evaluationContent: 'Đúng quy trình',
      evaluationImage: 'qt02.jpg',
    },
    {
      id: 7,
      criteriaGroup: 'Môi trường',
      criteria: 'MT01 - Xử lý rác',
      frequency: 'Hàng ngày',
      evaluationResult: 'Không đạt',
      evaluationContent: 'Cần phân loại',
      evaluationImage: 'mt01.jpg',
    },
    {
      id: 8,
      criteriaGroup: 'Môi trường',
      criteria: 'MT02 - Tiết kiệm',
      frequency: 'Hàng tháng',
      evaluationResult: 'Đạt',
      evaluationContent: 'Tiết kiệm tốt',
      evaluationImage: 'mt02.jpg',
    },
    {
      id: 9,
      criteriaGroup: 'Chất lượng',
      criteria: 'CL01 - KCS',
      frequency: 'Hàng ngày',
      evaluationResult: 'Đạt',
      evaluationContent: 'Đạt tiêu chuẩn',
      evaluationImage: 'cl01.jpg',
    },
    {
      id: 10,
      criteriaGroup: 'Chất lượng',
      criteria: 'CL02 - QC',
      frequency: 'Hàng tuần',
      evaluationResult: 'Đạt',
      evaluationContent: 'Kiểm soát tốt',
      evaluationImage: 'cl02.jpg',
    },
    {
      id: 11,
      criteriaGroup: 'Thiết bị',
      criteria: 'TB01 - Bảo trì',
      frequency: 'Hàng tháng',
      evaluationResult: 'Đạt',
      evaluationContent: 'Đúng lịch',
      evaluationImage: 'tb01.jpg',
    },
    {
      id: 12,
      criteriaGroup: 'Thiết bị',
      criteria: 'TB02 - Hiệu chuẩn',
      frequency: 'Hàng quý',
      evaluationResult: 'Đạt',
      evaluationContent: 'Định kỳ',
      evaluationImage: 'tb02.jpg',
    },
    {
      id: 13,
      criteriaGroup: 'Nhân sự',
      criteria: 'NS01 - Đào tạo',
      frequency: 'Hàng quý',
      evaluationResult: 'Đạt',
      evaluationContent: 'Đầy đủ',
      evaluationImage: 'ns01.jpg',
    },
    {
      id: 14,
      criteriaGroup: 'Nhân sự',
      criteria: 'NS02 - Đánh giá',
      frequency: '6 tháng',
      evaluationResult: 'Đạt',
      evaluationContent: 'Kịp thời',
      evaluationImage: 'ns02.jpg',
    },
    {
      id: 15,
      criteriaGroup: 'Văn phòng',
      criteria: 'VP01 - Tài liệu',
      frequency: 'Hàng tháng',
      evaluationResult: 'Đạt',
      evaluationContent: 'Lưu trữ tốt',
      evaluationImage: 'vp01.jpg',
    },
  ];

  planEvaluations = [
    {
      planCode: 'KH001',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Phòng Sản xuất',
      planFrequency: 'Hàng ngày',
      reportCode: 'BB001',
      reportTemplateName: 'BBKT Sản xuất',
      checkTarget: 'Máy A1',
      reportType: 'Định kỳ',
      reportGroup: 'Sản xuất',
      status: 'Mới',
      checkDate: '2024-01-15',
    },
    {
      planCode: 'KH002',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Phòng QC',
      planFrequency: 'Hàng tuần',
      reportCode: 'BB002',
      reportTemplateName: 'BBKT Chất lượng',
      checkTarget: 'Quy trình QC',
      reportType: 'Đột xuất',
      reportGroup: 'Chất lượng',
      status: 'Đang thực hiện',
      checkDate: '2024-01-16',
    },
    {
      planCode: 'KH003',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Nhà xưởng 1',
      planFrequency: 'Hàng tháng',
      reportCode: 'BB003',
      reportTemplateName: 'BBKT An toàn',
      checkTarget: 'PCCC',
      reportType: 'Định kỳ',
      reportGroup: 'An toàn',
      status: 'Hoàn thành',
      checkDate: '2024-01-17',
    },
    {
      planCode: 'KH004',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Kho nguyên liệu',
      planFrequency: 'Hàng quý',
      reportCode: 'BB004',
      reportTemplateName: 'BBKT Kho',
      checkTarget: 'Khu A',
      reportType: 'Định kỳ',
      reportGroup: 'Kho',
      status: 'Mới',
      checkDate: '2024-01-18',
    },
    {
      planCode: 'KH005',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Phòng R&D',
      planFrequency: 'Hàng tháng',
      reportCode: 'BB005',
      reportTemplateName: 'BBKT R&D',
      checkTarget: 'Phòng Lab',
      reportType: 'Đột xuất',
      reportGroup: 'R&D',
      status: 'Đang thực hiện',
      checkDate: '2024-01-19',
    },
    {
      planCode: 'KH006',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Phòng Bảo trì',
      planFrequency: 'Hàng tuần',
      reportCode: 'BB006',
      reportTemplateName: 'BBKT Thiết bị',
      checkTarget: 'Máy B2',
      reportType: 'Định kỳ',
      reportGroup: 'Bảo trì',
      status: 'Hoàn thành',
      checkDate: '2024-01-20',
    },
    {
      planCode: 'KH007',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Phòng HR',
      planFrequency: 'Hàng tháng',
      reportCode: 'BB007',
      reportTemplateName: 'BBKT Nhân sự',
      checkTarget: 'Đào tạo',
      reportType: 'Định kỳ',
      reportGroup: 'HR',
      status: 'Mới',
      checkDate: '2024-01-21',
    },
    {
      planCode: 'KH008',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Phòng IT',
      planFrequency: 'Hàng quý',
      reportCode: 'BB008',
      reportTemplateName: 'BBKT CNTT',
      checkTarget: 'Hệ thống',
      reportType: 'Đột xuất',
      reportGroup: 'IT',
      status: 'Đang thực hiện',
      checkDate: '2024-01-22',
    },
    {
      planCode: 'KH009',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Nhà xưởng 2',
      planFrequency: 'Hàng ngày',
      reportCode: 'BB009',
      reportTemplateName: 'BBKT 5S',
      checkTarget: 'Khu B',
      reportType: 'Định kỳ',
      reportGroup: '5S',
      status: 'Hoàn thành',
      checkDate: '2024-01-23',
    },
    {
      planCode: 'KH010',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Phòng Marketing',
      planFrequency: 'Hàng tháng',
      reportCode: 'BB010',
      reportTemplateName: 'BBKT Marketing',
      checkTarget: 'Chiến dịch',
      reportType: 'Định kỳ',
      reportGroup: 'Marketing',
      status: 'Mới',
      checkDate: '2024-01-24',
    },
    {
      planCode: 'KH011',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Phòng Kế toán',
      planFrequency: 'Hàng quý',
      reportCode: 'BB011',
      reportTemplateName: 'BBKT Tài chính',
      checkTarget: 'Sổ sách',
      reportType: 'Định kỳ',
      reportGroup: 'Kế toán',
      status: 'Đang thực hiện',
      checkDate: '2024-01-25',
    },
    {
      planCode: 'KH012',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Phòng Mua hàng',
      planFrequency: 'Hàng tuần',
      reportCode: 'BB012',
      reportTemplateName: 'BBKT Mua hàng',
      checkTarget: 'Nhà cung cấp',
      reportType: 'Đột xuất',
      reportGroup: 'Mua hàng',
      status: 'Hoàn thành',
      checkDate: '2024-01-26',
    },
    {
      planCode: 'KH013',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Phòng KCS',
      planFrequency: 'Hàng ngày',
      reportCode: 'BB013',
      reportTemplateName: 'BBKT KCS',
      checkTarget: 'QC Line',
      reportType: 'Định kỳ',
      reportGroup: 'KCS',
      status: 'Mới',
      checkDate: '2024-01-27',
    },
    {
      planCode: 'KH014',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Phòng ISO',
      planFrequency: 'Hàng tháng',
      reportCode: 'BB014',
      reportTemplateName: 'BBKT ISO',
      checkTarget: 'Quy trình',
      reportType: 'Định kỳ',
      reportGroup: 'ISO',
      status: 'Đang thực hiện',
      checkDate: '2024-01-28',
    },
    {
      planCode: 'KH015',
      planName: 'Kế hoạch Q1/2024',
      evaluationTarget: 'Phòng CSKH',
      planFrequency: 'Hàng tuần',
      reportCode: 'BB015',
      reportTemplateName: 'BBKT CSKH',
      checkTarget: 'Khiếu nại',
      reportType: 'Đột xuất',
      reportGroup: 'CSKH',
      status: 'Hoàn thành',
      checkDate: '2024-01-29',
    },
  ];

  checkPlanDetails: CheckPlanDetail[] = [
    { id: 1, score: 85, reportName: 'BBKT-2024-001', checkDate: '2024-03-01', nc: 2, ly: 1, notPass: 3 },
    { id: 2, score: 92, reportName: 'BBKT-2024-002', checkDate: '2024-03-02', nc: 1, ly: 0, notPass: 1 },
    { id: 3, score: 78, reportName: 'BBKT-2024-003', checkDate: '2024-03-03', nc: 3, ly: 2, notPass: 4 },
    { id: 4, score: 95, reportName: 'BBKT-2024-004', checkDate: '2024-03-04', nc: 0, ly: 1, notPass: 1 },
    { id: 5, score: 88, reportName: 'BBKT-2024-005', checkDate: '2024-03-05', nc: 2, ly: 0, notPass: 2 },
    { id: 6, score: 90, reportName: 'BBKT-2024-006', checkDate: '2024-03-06', nc: 1, ly: 1, notPass: 2 },
    { id: 7, score: 82, reportName: 'BBKT-2024-007', checkDate: '2024-03-07', nc: 2, ly: 2, notPass: 3 },
    { id: 8, score: 87, reportName: 'BBKT-2024-008', checkDate: '2024-03-08', nc: 1, ly: 1, notPass: 2 },
    { id: 9, score: 93, reportName: 'BBKT-2024-009', checkDate: '2024-03-09', nc: 0, ly: 2, notPass: 2 },
    { id: 10, score: 85, reportName: 'BBKT-2024-010', checkDate: '2024-03-10', nc: 2, ly: 0, notPass: 2 },
    { id: 11, score: 91, reportName: 'BBKT-2024-011', checkDate: '2024-03-11', nc: 1, ly: 1, notPass: 1 },
    { id: 12, score: 89, reportName: 'BBKT-2024-012', checkDate: '2024-03-12', nc: 1, ly: 2, notPass: 3 },
    { id: 13, score: 94, reportName: 'BBKT-2024-013', checkDate: '2024-03-13', nc: 0, ly: 1, notPass: 1 },
    { id: 14, score: 86, reportName: 'BBKT-2024-014', checkDate: '2024-03-14', nc: 2, ly: 1, notPass: 2 },
    { id: 15, score: 88, reportName: 'BBKT-2024-015', checkDate: '2024-03-15', nc: 1, ly: 0, notPass: 1 },
  ];

  criteriaSummaries: CriteriaSummary[] = [
    {
      id: 1,
      criteriaGroup: 'Quản lý văn bản',
      criteriaName: 'QT01 - Kiểm soát tài liệu',
      conclusion: 'Đầy đủ hồ sơ',
      evaluationContent: 'Các tài liệu được lưu trữ đúng quy định',
      evaluationImage: 'image1.jpg',
      status: 'Đạt',
    },
    {
      id: 2,
      criteriaGroup: 'Quản lý văn bản',
      criteriaName: 'QT02 - Kiểm soát hồ sơ',
      conclusion: 'Thiếu một số hồ sơ',
      evaluationContent: 'Cần bổ sung hồ sơ còn thiếu',
      evaluationImage: 'image2.jpg',
      status: 'Không đạt',
    },
    {
      id: 3,
      criteriaGroup: 'Quản lý văn bản',
      criteriaName: 'QT03 - Quản lý tài liệu nội bộ',
      conclusion: 'Hoàn thành',
      evaluationContent: 'Tài liệu được cập nhật đầy đủ',
      evaluationImage: 'image3.jpg',
      status: 'Đạt',
    },

    {
      id: 4,
      criteriaGroup: 'Quản lý nhân sự',
      criteriaName: 'NS01 - Đào tạo nhân viên',
      conclusion: 'Đúng kế hoạch',
      evaluationContent: 'Thực hiện đúng kế hoạch đào tạo',
      evaluationImage: 'image4.jpg',
      status: 'Đạt',
    },
    {
      id: 5,
      criteriaGroup: 'Quản lý nhân sự',
      criteriaName: 'NS02 - Đánh giá năng lực',
      conclusion: 'Chưa hoàn thành',
      evaluationContent: 'Còn thiếu báo cáo đánh giá',
      evaluationImage: 'image5.jpg',
      status: 'Không đạt',
    },

    {
      id: 6,
      criteriaGroup: 'Quy trình sản xuất',
      criteriaName: 'SX01 - Kiểm soát quy trình',
      conclusion: 'Tuân thủ',
      evaluationContent: 'Thực hiện đúng quy trình',
      evaluationImage: 'image6.jpg',
      status: 'Đạt',
    },
    {
      id: 7,
      criteriaGroup: 'Quy trình sản xuất',
      criteriaName: 'SX02 - An toàn lao động',
      conclusion: 'Cần cải thiện',
      evaluationContent: 'Một số khu vực chưa đảm bảo',
      evaluationImage: 'image7.jpg',
      status: 'Không đạt',
    },

    {
      id: 8,
      criteriaGroup: 'Quản lý thiết bị',
      criteriaName: 'TB01 - Bảo trì thiết bị',
      conclusion: 'Đúng lịch',
      evaluationContent: 'Thực hiện bảo trì định kỳ',
      evaluationImage: 'image8.jpg',
      status: 'Đạt',
    },
    {
      id: 9,
      criteriaGroup: 'Quản lý thiết bị',
      criteriaName: 'TB02 - Hiệu chuẩn',
      conclusion: 'Đang thực hiện',
      evaluationContent: 'Đang trong quá trình hiệu chuẩn',
      evaluationImage: 'image9.jpg',
      status: 'Chờ đánh giá',
    },

    {
      id: 10,
      criteriaGroup: 'Quản lý chất lượng',
      criteriaName: 'CL01 - Kiểm soát sản phẩm',
      conclusion: 'Đạt yêu cầu',
      evaluationContent: 'Sản phẩm đạt tiêu chuẩn',
      evaluationImage: 'image10.jpg',
      status: 'Đạt',
    },
    {
      id: 11,
      criteriaGroup: 'Quản lý chất lượng',
      criteriaName: 'CL02 - Xử lý sự cố',
      conclusion: 'Kịp thời',
      evaluationContent: 'Xử lý sự cố nhanh chóng',
      evaluationImage: 'image11.jpg',
      status: 'Đạt',
    },

    {
      id: 12,
      criteriaGroup: 'Môi trường',
      criteriaName: 'MT01 - Quản lý rác thải',
      conclusion: 'Chưa đạt',
      evaluationContent: 'Cần cải thiện phân loại',
      evaluationImage: 'image12.jpg',
      status: 'Không đạt',
    },
    {
      id: 13,
      criteriaGroup: 'Môi trường',
      criteriaName: 'MT02 - Tiết kiệm năng lượng',
      conclusion: 'Tốt',
      evaluationContent: 'Thực hiện đúng quy định',
      evaluationImage: 'image13.jpg',
      status: 'Đạt',
    },

    {
      id: 14,
      criteriaGroup: 'An toàn thông tin',
      criteriaName: 'ATTT01 - Bảo mật dữ liệu',
      conclusion: 'Đạt',
      evaluationContent: 'Tuân thủ quy định bảo mật',
      evaluationImage: 'image14.jpg',
      status: 'Đạt',
    },
    {
      id: 15,
      criteriaGroup: 'An toàn thông tin',
      criteriaName: 'ATTT02 - Sao lưu dữ liệu',
      conclusion: 'Thực hiện định kỳ',
      evaluationContent: 'Sao lưu đúng quy định',
      evaluationImage: 'image15.jpg',
      status: 'Đạt',
    },
  ];

  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  selectedPageSize: number = 10;
  first: number = 0;
  totalRecords: number = 0;
  dialogVisible = false;
  dialogCheckScript = false;
  dialogCheckPlan = false;
  dialogCheckPlanChild = false;
  conclusionCretia = false;
  dialogGeneralCheckPlan = false;
  dialogSummaryOfCriteriaConclusion = false;

  public router = inject(Router);
  protected planService = inject(PlanService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  protected summarizePlanDiaglog = inject(SummarizePlanComponent);

  trackId = (_index: number, item: IPlan): number => this.planService.getPlanIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.plans || this.plans.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
    this.planService.getPlanDetail().subscribe(res => {
      this.planDetailResults = res;
      this.loadTreeNodes();
      console.log('db trả về', res);
    });
    // this.loadTreeNodes();
    // console.log('plans', this.plans);

    // this.columnDefinitions = [
    //   {
    //     id: 'id',
    //     name: 'ID',
    //     field: 'id',
    //     sortable: true,
    //     filterable: true,
    //     resizable: true,
    //     width: 100,
    //   },
    //   {
    //   }
    // ]
  }

  // expandAll():void {
  //   this.expandedRows = this.planData.reduce((acc, p) => (acc[p.id] = true) && acc, {});
  // }

  // collapseAll():void {
  //   this.expandedRows = {};
  // }

  onPageSizeChange(event: any): void {
    console.log('event', event);
    this.selectedPageSize = event.rows;
    this.first = event.first;
    // this.load();
  }

  delete(plan: IPlan): void {
    const modalRef = this.modalService.open(PlanDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.plan = plan;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  // onFilter(event: Event, field: string):void {
  //   const element = event.target as HTMLInputElement;
  //   if (this.dt2) {
  //     this.dt2.filter(element.value, field, 'contains');
  //   }
  // }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
        this.loadTreeNodes();
        this.totalRecords = this.planDetailResults.length;
        console.log('res ', res);
        console.log('tree node', this.loadTreeNodes);
      },
    });
  }

  // Sao chép kế hoạch
  copyPlan(plan: any): void {
    this.router.navigate([`/plan/${plan}/edit`], {
      state: {
        mode: 'COPY', // Add mode flag
      },
    });
  }

  // Phân quyền thực hiện kiểm tra
  openModal(): void {
    this.modalService
      .open(this.userTesting, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        backdrop: 'static',
      })
      .result.then(
        result => {
          console.log('Modal closed');
        },
        reason => {
          console.log('Modal dismissed');
        },
      );
  }

  // Gộp BBKT
  openModalGross(): void {
    this.modalService
      .open(this.gross, {
        ariaLabelledBy: 'modal-gross-title',
        // size: 'xl',
        // fullscreen: true,
        backdrop: 'static',
        windowClass: 'gross-modal',
        centered: true,
      })
      .result.then(
        result => {
          console.log('Modal closed');
        },
        reason => {
          console.log('Modal dismissed');
        },
      );
  }

  navigateToInspectionReport(): void {
    // modal.dismiss();
    this.router.navigate(['inspection-report']);
  }

  navigateToGrossScript(): void {
    this.router.navigate(['gross-script']);
  }

  navigateToScript(): void {
    this.router.navigate(['script']);
  }

  navigateToSummarizePlan(): void {
    this.router.navigate(['summarize-plan']);
  }

  openModalCriteria(): void {
    this.modalService
      .open(this.criteria, {
        ariaLabelledBy: 'modal-criteria-title',
        size: 'xl',
        backdrop: 'static',
      })
      .result.then(
        result => {
          console.log('Modal closed');
        },
        reason => {
          console.log('Modal dismissed');
        },
      );
  }

  openModalEvaluation(): void {
    this.modalService
      .open(this.evaluationResult, {
        ariaLabelledBy: 'modal-inspection-data-title',
        size: 'xl',
        backdrop: 'static',
      })
      .result.then(
        result => {
          console.log('Modal closed');
        },
        reason => {
          console.log('Modal dismissed');
        },
      );
  }

  openModalInspectionData(): void {
    this.modalService
      .open(this.inspectionData, {
        ariaLabelledBy: 'modal-inspection-data-itle',
        size: 'xl',
        backdrop: 'static',
      })
      .result.then(
        result => {
          console.log('Modal closed');
        },
        reason => {
          console.log('Modal dismissed');
        },
      );
  }

  openModalDeltailInspectionData(): void {
    this.modalService
      .open(this.detailInspectionData, {
        ariaLabelledBy: 'modal-detail-inspection-data-title',
        size: 'xl',
        backdrop: 'static',
      })
      .result.then(
        result => {
          console.log('Modal closed');
        },
        reason => {
          console.log('Modal dismissed');
        },
      );
  }

  openModalCriteriaConclusion(): void {
    this.modalService
      .open(this.criteriaConclusion, {
        ariaDescribedBy: 'modal-criteria-conclusion-title',
        size: 'xl',
        backdrop: 'static',
      })
      .result.then(
        result => {
          console.log('Modal closed');
        },
        reason => {
          console.log('Modal dismissed');
        },
      );
  }

  openModalEvaluationPlan(): void {
    this.modalService
      .open(this.evaluationPlan, {
        ariaDescribedBy: 'modal-evaluation-plan-title',
        size: 'xl',
        backdrop: 'static',
      })
      .result.then(
        result => {
          console.log('Modal closed');
        },
        reason => {
          console.log('Modal dismissed');
        },
      );
  }

  onRowExpand(event: any): void {
    const rowData = event.data;
    this.expandedRows[rowData.id] = true;
    this.loadPlanDetails(rowData.id);
    console.log('rowData', rowData);
  }

  loadPlanDetails(planId: number): void {
    this.planService.getPlanDetail().subscribe(res => {
      this.planDetailResults = res;
    });
  }

  onRowCollapse(event: any): void {
    const rowData = event.data;
    delete this.expandedRows[rowData.id];
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  loadTreeNodes(): void {
    if (this.planDetailResults) {
      this.treeNodes = this.planDetailResults.map(plan => ({
        data: {
          id: plan.id,
          code: plan.code,
          name: plan.name,
          subjectOfAssetmentPlan: plan.subjectOfAssetmentPlan,
          frequency: plan.frequency,
          timeStart: plan.timeStart,
          timeEnd: plan.timeEnd,
          statusPlan: plan.statusPlan,
          testObject: plan.testObject,
          reportTypeId: plan.reportTypeId,
          reportTypeName: plan.reportTypeName,
          numberOfCheck: plan.numberOfCheck,
          implementer: plan.implementer,
          paticipant: plan.paticipant,
          checkerGroup: plan.checkerGroup,
          checkerName: plan.checkerName,
          checkerGroupId: plan.checkerGroupId,
          checkerId: plan.checkerId,
          gross: plan.gross,
          timeCheck: plan.timeCheck,
          nameResult: plan.nameResult,
          scriptId: plan.scriptId,
          createBy: plan.createBy,
          status: plan.status,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
          updateBy: plan.updateBy,
        },
        children: [],
        expanded: false,
      }));
    }
  }

  onGlobalSearch(event: any): void {
    this.dt2.filterGlobal(event.target.value, 'contains');
  }

  showDialogExcel(): void {
    this.dialogVisible = true;
  }

  showDialogCheckScript(): void {
    this.dialogCheckScript = true;
  }

  showDialogCheckPlan(): void {
    this.dialogCheckPlan = true;
  }

  showDialogCheckPlanChild(): void {
    this.dialogCheckPlanChild = true;
  }

  showDialogConclusionCretia(): void {
    this.conclusionCretia = true;
  }

  showSummarizeDialog(): void {
    this.summarizePlanDiaglog.dialogGeneralCheckPlan = true;
    console.log('click open modal');
  }

  showDialogGeneralCheckPlan(): void {
    this.dialogGeneralCheckPlan = true;
  }

  showDialogSummaryOfCriteriaConclusion(): void {
    this.dialogSummaryOfCriteriaConclusion = true;
  }

  getSeverity(status: string): any {
    switch (status) {
      case 'Đạt':
        return 'success';
      case 'Không đạt':
        return 'danger';
      case 'Chờ đánh giá':
        return 'warning';
    }
  }

  // deleteRow(index: number): void {
  //   this.planDetailResults = this.planDetailResults.filter((_, i) => i !== index);
  //   const Toast = Swal.mixin({
  //     toast: true,
  //     position: 'top-end',
  //     showConfirmButton: false,
  //     timer: 3000,
  //     timerProgressBar: true,
  //     didOpen: toast => {
  //       toast.onmouseenter = Swal.stopTimer;
  //       toast.onmouseleave = Swal.resumeTimer;
  //     },
  //   });
  //   Toast.fire({
  //     icon: 'success',
  //     title: 'Xóa thành công',
  //   });
  //   console.log('Row deleted at index:', index);
  // }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.plans = this.refineData(dataFromBody);
    // this.treeNodes = this.transformToTreeNodes(this.plans); // Transform to TreeNode
    this.convertPlansToTreeNodes();
  }

  protected convertPlansToTreeNodes(): void {
    if (this.plans) {
      this.treeNodes = this.plans.map(plan => ({
        data: plan,
        children: [],
      }));
    }
  }

  protected onResponseSuccess2(response: EntityArrayResponseType): void {
    const dataFromServer = this.fillComponentAttributesFromResponseBody(response.body);
    this.plans = dataFromServer;
  }

  protected refineData(data: IPlan[]): IPlan[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IPlan[] | null): IPlan[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.planService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }

  protected transformToTreeNodes(plans: IPlan[]): TreeNode[] {
    return plans.map(plan => ({
      data: plan,
      children: [],
    }));
  }
}
