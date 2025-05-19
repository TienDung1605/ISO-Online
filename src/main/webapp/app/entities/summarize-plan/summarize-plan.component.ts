import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { SortByDirective, SortDirective } from 'app/shared/sort';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SummarizePlanService } from './summarize-plan.service';
import { TagModule } from 'primeng/tag';

interface SummarizePlanItem {
  code: string;
  name: string;
  inspectionObject: string;
  totalInspection: number;
  pointScale: number;
  totalErrorPoints: number;
  totalBbktPoints: number;
  averagePoints: number;
  totalErrors: number;
}

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
  selector: 'jhi-summarize-plan',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    FormatMediumDatetimePipe,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    NgbModule,
    DialogModule,
    TagModule,
  ],
  templateUrl: './summarize-plan.component.html',
  styleUrls: ['../shared.component.css'],
})
export class SummarizePlanComponent implements OnInit {
  // summarizePlanResult: any[] = []
  dialogGeneralCheckPlan = false;
  dialogSummaryOfCriteriaConclusion = false;
  summarizePlanResult = [
    {
      bbktCode: 'BBKT001',
      bbktName: 'Kiểm tra chất lượng sản phẩm',
      inspectionObject: 'Sản phẩm A',
      totalInspection: 10,
      pointScale: 100,
      totalErrorPoints: 50,
      totalBbktPoints: 80,
      averagePoints: 80,
      totalErrors: 20,
    },
    {
      bbktCode: 'BBKT002',
      bbktName: 'Kiểm tra an toàn lao động',
      inspectionObject: 'Nhân viên A',
      totalInspection: 5,
      pointScale: 50,
      totalErrorPoints: 20,
      totalBbktPoints: 40,
      averagePoints: 80,
      totalErrors: 10,
    },
    {
      bbktCode: 'BBKT003',
      bbktName: 'Kiểm tra chất lượng dịch vụ',
      inspectionObject: 'Dịch vụ A',
      totalInspection: 8,
      pointScale: 80,
      totalErrorPoints: 30,
      totalBbktPoints: 60,
      averagePoints: 75,
      totalErrors: 15,
    },
    {
      bbktCode: 'BBKT004',
      bbktName: 'Kiểm tra an toàn môi trường',
      inspectionObject: 'Môi trường A',
      totalInspection: 12,
      pointScale: 120,
      totalErrorPoints: 40,
      totalBbktPoints: 80,
      averagePoints: 80,
      totalErrors: 20,
    },
    {
      bbktCode: 'BBKT005',
      bbktName: 'Kiểm tra chất lượng sản phẩm',
      inspectionObject: 'Sản phẩm B',
      totalInspection: 10,
      pointScale: 100,
      totalErrorPoints: 50,
      totalBbktPoints: 80,
      averagePoints: 80,
      totalErrors: 20,
    },
    {
      bbktCode: 'BBKT006',
      bbktName: 'Kiểm tra an toàn lao động',
      inspectionObject: 'Nhân viên B',
      totalInspection: 5,
      pointScale: 50,
      totalErrorPoints: 20,
      totalBbktPoints: 40,
      averagePoints: 80,
      totalErrors: 10,
    },
    {
      bbktCode: 'BBKT007',
      bbktName: 'Kiểm tra chất lượng dịch vụ',
      inspectionObject: 'Dịch vụ B',
      totalInspection: 8,
      pointScale: 80,
      totalErrorPoints: 30,
      totalBbktPoints: 60,
      averagePoints: 75,
      totalErrors: 15,
    },
    {
      bbktCode: 'BBKT008',
      bbktName: 'Kiểm tra an toàn môi trường',
      inspectionObject: 'Môi trường B',
      totalInspection: 12,
      pointScale: 120,
      totalErrorPoints: 40,
      totalBbktPoints: 80,
      averagePoints: 80,
      totalErrors: 20,
    },
    {
      bbktCode: 'BBKT009',
      bbktName: 'Kiểm tra chất lượng sản phẩm',
      inspectionObject: 'Sản phẩm C',
      totalInspection: 10,
      pointScale: 100,
      totalErrorPoints: 50,
      totalBbktPoints: 80,
      averagePoints: 80,
      totalErrors: 20,
    },
    {
      bbktCode: 'BBKT010',
      bbktName: 'Kiểm tra an toàn lao động',
      inspectionObject: 'Nhân viên C',
      totalInspection: 5,
      pointScale: 50,
      totalErrorPoints: 20,
      totalBbktPoints: 40,
      averagePoints: 80,
      totalErrors: 10,
    },
    {
      bbktCode: 'BBKT011',
      bbktName: 'Kiểm tra chất lượng dịch vụ',
      inspectionObject: 'Dịch vụ C',
      totalInspection: 8,
      pointScale: 80,
      totalErrorPoints: 30,
      totalBbktPoints: 60,
      averagePoints: 75,
      totalErrors: 15,
    },
    {
      bbktCode: 'BBKT012',
      bbktName: 'Kiểm tra an toàn môi trường',
      inspectionObject: 'Môi trường C',
      totalInspection: 12,
      pointScale: 120,
      totalErrorPoints: 40,
      totalBbktPoints: 80,
      averagePoints: 80,
      totalErrors: 20,
    },
    {
      bbktCode: 'BBKT013',
      bbktName: 'Kiểm tra chất lượng sản phẩm',
      inspectionObject: 'Sản phẩm D',
      totalInspection: 10,
      pointScale: 100,
      totalErrorPoints: 50,
      totalBbktPoints: 80,
      averagePoints: 80,
      totalErrors: 20,
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
  protected summarizePlanService = inject(SummarizePlanService);
  constructor() {
    console.log('SummarizePlanComponent constructed');
  }

  ngOnInit(): void {
    console.log('aaa');
    this.summarizePlanService.getSummarizePlan().subscribe(res => {
      this.summarizePlanResult = res.map((item: SummarizePlanItem) => ({
        bbktCode: item.code,
        bbktName: item.name,
        inspectionObject: item.inspectionObject,
        totalInspection: item.totalInspection,
        pointScale: item.pointScale,
        totalErrorPoints: item.totalErrorPoints,
        totalBbktPoints: item.totalBbktPoints,
        averagePoints: item.averagePoints,
        totalErrors: item.totalErrors,
      }));
    });
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
}
