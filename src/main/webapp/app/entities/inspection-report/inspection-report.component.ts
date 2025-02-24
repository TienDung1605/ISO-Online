import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
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
import { TreeTableModule } from 'primeng/treetable';

@Component({
  selector: 'jhi-inspection-report',
  standalone: true,
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
  ],
  templateUrl: './inspection-report.component.html',
  styleUrl: './inspection-report.component.scss',
})
export class InspectionReportComponent {
  @ViewChild('conclusionInfo') conclusionInfo!: TemplateRef<any>;
  protected modalService = inject(NgbModal);

  // inspectionReport = {
  //   planCode: 'KH-2024-001',
  //   planName: 'Kế hoạch kiểm tra Q1/2024',
  //   evaluationObject: 'Phòng Kinh doanh',
  //   frequency: 'Hàng quý',
  //   reportCode: 'BBKT-001',
  //   reportName: 'Biên bản kiểm tra nội bộ',
  //   testObject: 'Nhân viên',
  //   reportType: 'Kiểm tra định kỳ',
  //   reportGroup: 'Nhóm A',
  //   startTime: '2024-01-01',
  //   endTime: '2024-03-31'
  // }
  openModalConclusionInfo(): void {
    this.modalService
      .open(this.conclusionInfo, {
        ariaDescribedBy: 'modal-conclusion-info-title',
        size: 'xl',
        backdrop: 'static',
      })
      .result.then(
        result => {
          console.log(`Closed with: ${result}`);
        },
        reason => {
          console.log(`Dismissed ${reason}`);
        },
      );
  }
}
