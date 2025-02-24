import { Component, inject, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { SortByDirective, SortDirective } from 'app/shared/sort';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'jhi-gross-script',
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
    CheckboxModule,
    CommonModule,
  ],
  templateUrl: './gross-script.component.html',
  styleUrls: ['../shared.component.css'],
})
export class GrossScriptComponent {
  @ViewChild('criteria') criteria!: TemplateRef<any>;
  @ViewChild('evaluationResult') evaluationResult!: TemplateRef<any>;
  @ViewChild('inspectionData') inspectionData!: TemplateRef<any>;
  selectAll = false;
  testObjects = [
    { id: 1, name: 'Phòng Kinh doanh' },
    { id: 2, name: 'Phòng Kỹ thuật' },
    { id: 3, name: 'Phòng Nhân sự' },
  ];

  conversions = [
    { id: 1, code: 'KD-01' },
    { id: 2, code: 'KT-01' },
    { id: 3, code: 'NS-01' },
  ];

  reportTemplates = [
    { id: 1, name: 'BBKT-2024-01' },
    { id: 2, name: 'BBKT-2024-02' },
    { id: 3, name: 'BBKT-2024-03' },
  ];

  planCodes = [
    { id: 1, code: 'KH-001' },
    { id: 2, code: 'KH-002' },
    { id: 3, code: 'KH-003' },
  ];

  selectedTestObject: any;
  selectedConversion: any;
  selectedTemplate: any;
  selectedPlanCode: any;
  grossScripts: any[] = [
    {
      id: 1,
      planCode: 'KH001',
      planName: 'Kế hoạch đánh giá Q1/2024',
      evaluationObject: 'Phòng Kinh doanh',
      frequency: 'Hàng quý',
      reportCode: 'BBKT001',
      reportName: 'Biên bản kiểm tra định kỳ',
      testObject: 'Nhân viên',
      reportType: 'Đánh giá nội bộ',
      reportGroup: 'Nhóm A',
      status: 'Đang thực hiện',
      merge: true,
      checkDate: '2024-03-15',
    },
    {
      id: 2,
      planCode: 'KH002',
      planName: 'Kế hoạch đánh giá Q2/2024',
      evaluationObject: 'Phòng Kỹ thuật',
      frequency: 'Hàng quý',
      reportCode: 'BBKT002',
      reportName: 'Biên bản kiểm tra đột xuất',
      testObject: 'Quy trình',
      reportType: 'Đánh giá chéo',
      reportGroup: 'Nhóm B',
      status: 'Chưa thực hiện',
      merge: false,
      checkDate: '2024-06-15',
    },
  ];

  planData = [
    {
      id: 1,
      code: 'TC-001',
      name: 'Kiểm tra định kỳ hàng tháng',
      description: 'Đang thực hiện',
      status: 'Active',
    },
    {
      id: 2,
      code: 'TC-002',
      name: 'Đánh giá nội bộ quý',
      description: 'Hoàn thành',
      status: 'Active',
    },
    {
      id: 3,
      code: 'TC-003',
      name: 'Kiểm tra đột xuất',
      description: 'Chưa thực hiện',
      status: 'Inactive',
    },
    {
      id: 4,
      code: 'TC-004',
      name: 'Đánh giá KPI nhân viên',
      description: 'Đang thực hiện',
      status: 'Active',
    },
    {
      id: 5,
      code: 'TC-005',
      name: 'Kiểm tra tuân thủ quy trình',
      description: 'Hoàn thành',
      status: 'Active',
    },
  ];

  evaluationReports = [
    {
      id: 1,
      reportCode: 'BBKT-001',
      testObject: 'Phòng Kinh doanh',
      frequency: 'Hàng tháng',
      evaluation: 'Đạt',
      evaluationContent: 'Hoàn thành KPI tháng',
      evaluationImage: 'image1.jpg',
      status: 'Hoàn thành',
    },
    {
      id: 2,
      reportCode: 'BBKT-002',
      testObject: 'Phòng Kỹ thuật',
      frequency: 'Hàng quý',
      evaluation: 'Chưa đạt',
      evaluationContent: 'Cần cải thiện quy trình',
      evaluationImage: 'image2.jpg',
      status: 'Đang xử lý',
    },
    {
      id: 3,
      reportCode: 'BBKT-003',
      testObject: 'Phòng Nhân sự',
      frequency: 'Hàng năm',
      evaluation: 'Đạt',
      evaluationContent: 'Đúng quy trình',
      evaluationImage: 'image3.jpg',
      status: 'Hoàn thành',
    },
  ];

  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  ngOnInit(): void {
    console.log('aaa');
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.grossScripts.forEach(script => {
      script.merge = this.selectAll;
    });
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
}
