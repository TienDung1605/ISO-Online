import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
import { SummarizePlanService } from '../service/summarize-plan.service';
import { TagModule } from 'primeng/tag';
import { ConvertService } from 'app/entities/convert/service/convert.service';
import { CommonModule } from '@angular/common';
import { ReportService } from 'app/entities/report/service/report.service';
import { PlanGroupService } from 'app/entities/plan-group/service/plan-group.service';

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
    CommonModule,
  ],
  templateUrl: './summarize-plan.component.html',
  styleUrls: ['../../shared.component.css'],
})
export class SummarizePlanComponent implements OnInit {
  dialogGeneralCheckPlan = false;
  dialogSummaryOfCriteriaConclusion = false;
  dialogViewImage = false;
  summarizePlanResult: any[] = [];
  summarizeReportResult: any[] = [];
  listEvalReportsBase: any = [];
  criteriaSummaries: any = [];
  listImgReports: any[] = [];
  plan: any = {};
  report: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    protected summarizePlanService: SummarizePlanService,
    private convertService: ConvertService,
    private reportService: ReportService,
    private planGroupService: PlanGroupService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plan }) => {
      this.plan = plan;
      this.summarizePlanService.getStaitcatial(plan.id).subscribe(res => {
        this.summarizePlanResult = res;
      });
    });
    this.convertService.query().subscribe(res => {
      this.listEvalReportsBase = res.body;
    });
  }

  showDialogGeneralCheckPlan(data: any): void {
    this.report = data;
    this.reportService.getAllStatisticalByReportId(this.plan.id, data.reportId).subscribe(res => {
      this.summarizeReportResult = res.body;
    });
    this.dialogGeneralCheckPlan = true;
  }

  showDialogSummaryOfCriteriaConclusion(data: any): void {
    this.planGroupService.findAllDetailByHistoryAndReportId(data.planGroupHistoryId, this.report.reportId).subscribe(res => {
      this.criteriaSummaries = res.body;
      this.criteriaSummaries.sort((a: any, b: any) => {
        if (a.criterialGroupName < b.criterialGroupName) return -1;
        if (a.criterialGroupName > b.criterialGroupName) return 1;
        return 0;
      });
    });
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

  converTotalPointError(data: any) {
    const markNC = this.listEvalReportsBase.find((item: any) => item.name == 'NC');
    const markLC = this.listEvalReportsBase.find((item: any) => item.name == 'LY');
    const totalPointError = data.sumOfLy * markLC.mark + data.sumOfNc * markNC.mark;
    return data.convertScore == 'Tính điểm' ? totalPointError : data.sumOfFail;
  }

  totalPointSummarize(data: any) {
    if (this.report.convertScore == 'Tính điểm') {
      const markNC = this.listEvalReportsBase.find((item: any) => item.name == 'NC');
      const markLC = this.listEvalReportsBase.find((item: any) => item.name == 'LY');
      const totalPointSummarize = this.report.scoreScale - (data.sumOfLy * markLC.mark + data.sumOfNc * markNC.mark);
      return totalPointSummarize;
    } else {
      return this.report.scoreScale;
    }
  }

  showDialogViewImg(data: any) {
    this.listImgReports = JSON.parse(data);
    this.dialogViewImage = true;
  }
}
