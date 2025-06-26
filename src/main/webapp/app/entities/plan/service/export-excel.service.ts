import { inject, Injectable } from '@angular/core';
import { CheckTargetService } from 'app/entities/check-target/service/check-target.service';
import { CheckerGroupService } from 'app/entities/checker-group/service/checker-group.service';
import { ConvertService } from 'app/entities/convert/service/convert.service';
import { PlanGroupService } from 'app/entities/plan-group/service/plan-group.service';
import { ReportService } from 'app/entities/report/service/report.service';
import dayjs from 'dayjs/esm';
import FileSaver from 'file-saver';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { RemediationPlanService } from './remediationPlan.service';

@Injectable({ providedIn: 'root' })
export class ExportExcelService {
  protected checkTargetService = inject(CheckTargetService);
  protected checkGroupService = inject(CheckerGroupService);
  protected reportService = inject(ReportService);
  protected convertService = inject(ConvertService);
  protected planGrService = inject(PlanGroupService);
  protected remediationPlanService = inject(RemediationPlanService);

  days = Array.from({ length: 31 }, (_, i) => i + 1);
  months: string[] = [];
  listRemeDetailByExcel: any[] = [];
  listRecheckDetailByExcel: any[] = [];

  async loadReport(reportId: number): Promise<any> {
    const res = await firstValueFrom(this.reportService.find(reportId));
    return res.body;
  }

  async loadData(reportId: number): Promise<any[]> {
    const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';
    const res = await firstValueFrom(this.planGrService.findAllDetailByReportId(reportId));
    const listEvalReports = (res.body || [])
      .filter(item => item.result)
      .sort((a, b) => {
        const dateA = dayjs(a.createdAt, DATE_FORMAT);
        const dateB = dayjs(b.createdAt, DATE_FORMAT);
        if (!dateA.isValid()) return 1;
        if (!dateB.isValid()) return -1;
        return dateA.valueOf() - dateB.valueOf();
      })
      .map(item => ({
        ...item,
        createdAt:
          typeof item.createdAt?.format === 'function'
            ? item.createdAt.format(DATE_FORMAT)
            : dayjs(item.createdAt, DATE_FORMAT).isValid()
              ? dayjs(item.createdAt, DATE_FORMAT).format(DATE_FORMAT)
              : String(item.createdAt),
      }));
    const grouped: Record<string, any> = {};
    const monthsSet: Set<string> = new Set();
    listEvalReports.forEach(item => {
      const createdAt = dayjs(item.createdAt, DATE_FORMAT);
      const month = createdAt.format('MM/YYYY');
      const dayKey = `day${createdAt.date()}`;
      monthsSet.add(month);
      const key = `${item.criterialGroupName}_${item.criterialName}_${item.frequency}`;
      if (!grouped[key]) {
        grouped[key] = {
          criterialGroupName: item.criterialGroupName,
          criterialName: item.criterialName,
          frequency: item.frequency,
          monthData: {},
        };
      }
      const monthData = grouped[key].monthData;
      monthData[month] = monthData[month] || {};
      monthData[month][dayKey] = monthData[month][dayKey] || [];
      monthData[month][dayKey].push(item.result);
    });

    this.months = Array.from(monthsSet).sort((a, b) => {
      const [mA, yA] = a.split('/').map(Number);
      const [mB, yB] = b.split('/').map(Number);
      return yA === yB ? mA - mB : yA - yB;
    });
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);

    return Object.values(grouped).sort((a, b) => a.criterialName.localeCompare(b.criterialName));
  }

  async exportToExcel(reportId: number): Promise<void> {
    // prepare Data
    const report = await this.loadReport(reportId);
    this.remediationPlanService.getRemediationPlanDetailsByReportId(report.id).subscribe(res => {
      this.listRemeDetailByExcel = res.body;
    });
    this.remediationPlanService.getRecheckByReportId(report.id).subscribe(res => {
      this.listRecheckDetailByExcel = res.body;
    });
    const groupedRows = (await this.loadData(reportId)) || [];
    var listEvalReportBase: any[] = [];
    this.convertService.query().subscribe(res => {
      listEvalReportBase = res.body || [];
    });

    const listCheckTarget = (await firstValueFrom(this.checkTargetService.query())).body || [];
    const testOfObj = listCheckTarget.find(item => item.name == report.testOfObject);
    const listCheckGroup = (await firstValueFrom(this.checkGroupService.query())).body || [];
    const checkGroupByTestOfObject: any = listCheckGroup.find(check => check.id == testOfObj?.checkGroupId);
    const markNC = listEvalReportBase.find((item: any) => item.name == 'NC');
    const markLY = listEvalReportBase.find((item: any) => item.name == 'LY');
    const topRows: any[][] = [];

    const fileName = 'BaoCaoTieuChi';
    const excelExtension = '.xlsx';
    topRows.push(['CHECKLIST KIỂM TRA VIỆC TUÂN THỦ VÀ DUY TRÌ HTQLCL ĐỨC ĐỊA PHO CHẤT LƯỢC']);
    topRows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Số: ']);
    topRows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Ngày ban hành: ']);
    topRows.push(['']);
    topRows.push(['Tổng chung 100 điểm khi thực hiện tuân thủ 100%. Cuối tháng căn cứ để tính điểm:']);
    topRows.push([
      `- NC: là các lỗi liên quan có quy định nhưng không thực hiện hoặc có tình thực hiện sai (đã được đào tạo từ 2 lần trở lên về văn bản), sai thông số, quy trình công nghệ vẫn đánh giá đạt yêu cầu -> trừ ${markNC.mark} điểm/1 lỗi NC`,
    ]);
    topRows.push([
      `- LY: là có thực hiện nhưng chưa đúng do chưa hiểu, hoặc các lỗi liên quan đến ghi chép, cập nhật dữ liệu chậm -> trừ ${markLY.mark} điểm/1 lỗi LY`,
    ]);
    topRows.push(['']);
    topRows.push([`Tổ SX: ${report.testOfObject}`, '', `Ngành: ${checkGroupByTestOfObject.name}`]);
    topRows.push(['SK:']);
    const numberOfTopRows = topRows.length;

    let headerRow1 = ['Nhóm tiêu chí', 'Tiêu chí', 'Tần suất'];
    let headerRow2 = ['', '', ''];

    const numberOfDataColumns = this.months.length * this.days.length;

    const ncCountsPerColumn: number[] = new Array(numberOfDataColumns).fill(0);
    const lyCountsPerColumn: number[] = new Array(numberOfDataColumns).fill(0);
    const failCountsPerColumn: number[] = new Array(numberOfDataColumns).fill(0);
    const passCountsPerColumn: number[] = new Array(numberOfDataColumns).fill(0);
    let totalNC = 0;
    let totalLY = 0;
    let totalFail = 0;
    let totalPass = 0;

    this.months.forEach(month => {
      headerRow1.push(month);
      for (let i = 0; i < this.days.length - 1; i++) {
        headerRow1.push('');
      }
      this.days.forEach(day => {
        headerRow2.push(day.toString());
      });
    });

    headerRow1.push('Biện pháp khắc phục', 'Ghi chú', 'Người thực hiện', 'Thời gian', 'Đánh giá khắc phục', 'Ghi chú (ĐGKPH)');
    headerRow2.push('', '', '', '', '', '');
    const numberOfNewFixedColumns = 6;

    const dataForExport: any[][] = [];
    const merges: any[] = [];

    topRows.forEach(row => dataForExport.push(row));

    dataForExport.push(headerRow1);
    dataForExport.push(headerRow2);

    // Xử lý merges cho header (không thay đổi)
    const headerRowStartIndex = numberOfTopRows;
    const headerRowEndIndex = numberOfTopRows + 1;

    merges.push({ s: { r: headerRowStartIndex, c: 0 }, e: { r: headerRowEndIndex, c: 0 } });
    merges.push({ s: { r: headerRowStartIndex, c: 1 }, e: { r: headerRowEndIndex, c: 1 } });
    merges.push({ s: { r: headerRowStartIndex, c: 2 }, e: { r: headerRowEndIndex, c: 2 } });

    let currentColHeader = 3;
    this.months.forEach((month, monthIndex) => {
      merges.push({
        s: { r: headerRowStartIndex, c: currentColHeader },
        e: { r: headerRowStartIndex, c: currentColHeader + this.days.length - 1 },
      });
      currentColHeader += this.days.length;
    });

    let currentRowForData = headerRowEndIndex + 1; // Bắt đầu từ dòng ngay sau header

    groupedRows.forEach(row => {
      let allRemediationSolutions: any[] = [];
      if (this.listRemeDetailByExcel && this.listRemeDetailByExcel.length > 0) {
        allRemediationSolutions = this.listRemeDetailByExcel.filter(
          (remedy: any) => remedy.criterialGroupName === row.criterialGroupName && remedy.criterialName === row.criterialName,
        );
      }

      const effectiveRemediationSolutions = allRemediationSolutions.length > 0 ? allRemediationSolutions : [null];

      let totalRowsForThisCriteria = 0;
      effectiveRemediationSolutions.forEach(rem => {
        if (rem) {
          const relatedRechecks = (this.listRecheckDetailByExcel || []).filter(
            (recheck: any) => recheck.remediationPlanDetailId === rem.id,
          );
          totalRowsForThisCriteria += relatedRechecks.length > 0 ? relatedRechecks.length : 1;
        } else {
          totalRowsForThisCriteria += 1;
        }
      });

      for (let solIndex = 0; solIndex < effectiveRemediationSolutions.length; solIndex++) {
        const currentRemedy = effectiveRemediationSolutions[solIndex];

        let relatedRechecks: any[] = [];
        if (currentRemedy) {
          relatedRechecks = (this.listRecheckDetailByExcel || []).filter(
            (recheck: any) => recheck.remediationPlanDetailId === currentRemedy.id,
          );
        }

        const effectiveRechecks = relatedRechecks.length > 0 ? relatedRechecks : [null];

        for (let recheckIndex = 0; recheckIndex < effectiveRechecks.length; recheckIndex++) {
          let rowData: any[] = [];
          const currentRecheck = effectiveRechecks[recheckIndex];

          // --- Cột Nhóm tiêu chí, Tiêu chí, Tần suất (Merge theo tiêu chí) ---
          // Chỉ điền giá trị nếu đây là dòng đầu tiên của toàn bộ khối merge
          if (solIndex === 0 && recheckIndex === 0) {
            rowData.push(row.criterialGroupName);
            rowData.push(row.criterialName);
            rowData.push(row.frequency);
          } else {
            // Để null cho các ô sẽ bị merge, giúp chúng hiển thị trống và "sạch"
            rowData.push(null);
            rowData.push(null);
            rowData.push(null);
          }

          // --- Các cột ngày (Không merge, chỉ hiển thị ở dòng đầu tiên của tiêu chí) ---
          let currentColumnIndex = 0;
          this.months.forEach((month, monthIndex) => {
            this.days.forEach((day, dayIndex) => {
              const dayKey = `day${day}`;
              if (solIndex === 0 && recheckIndex === 0) {
                // Chỉ điền dữ liệu ngày ở dòng đầu tiên của tiêu chí
                if (row.monthData && row.monthData[month] && row.monthData[month][dayKey]?.length) {
                  const values = row.monthData[month][dayKey];
                  let displayValue = '';

                  const hasNC = values.includes('NC');
                  const hasLY = values.includes('LY');
                  const hasPASS = values.includes('PASS');
                  const hasAchieved = values.includes('Đạt');
                  const hasFail = values.includes('Không đạt');

                  // Đếm tổng NC/LY/Fail chỉ một lần cho mỗi tiêu chí (tại dòng đầu tiên của tiêu chí)
                  // Logic đếm này vẫn chỉ thực hiện khi solIndex === 0 && recheckIndex === 0
                  if (hasNC) {
                    ncCountsPerColumn[currentColumnIndex]++;
                    totalNC++;
                  }
                  if (hasLY) {
                    lyCountsPerColumn[currentColumnIndex]++;
                    totalLY++;
                  }
                  if (hasFail) {
                    failCountsPerColumn[currentColumnIndex]++;
                    totalFail++;
                  }
                  if (hasAchieved) {
                    passCountsPerColumn[currentColumnIndex]++;
                    totalPass++;
                  }

                  if (hasNC && hasLY) {
                    displayValue = 'NC, LY';
                  } else if (hasNC) {
                    displayValue = 'NC';
                  } else if (hasLY) {
                    displayValue = 'LY';
                  } else if (hasPASS || hasAchieved) {
                    displayValue = '✓';
                  } else if (hasFail) {
                    displayValue = '0';
                  }
                  rowData.push(displayValue);
                } else {
                  if (report.convertScore === 'Bước nhảy') {
                    rowData.push('/');
                  } else {
                    rowData.push('');
                  }
                }
              } else {
                rowData.push(null); // Để null cho các dòng con của tiêu chí
              }
              currentColumnIndex++;
            });
          });

          // --- Cột Biện pháp khắc phục, Ghi chú, Người thực hiện, Thời gian (Merge theo Biện pháp khắc phục) ---
          let solutionValue = '';
          let noteValue = '';
          let userHandleValue = '';
          let planTimeCompleteValue = '';

          if (currentRemedy) {
            solutionValue = currentRemedy.solution || '';
            noteValue = currentRemedy.note || '';
            userHandleValue = currentRemedy.userHandle || '';
            if (currentRemedy.planTimeComplete) {
              planTimeCompleteValue = new Date(currentRemedy.planTimeComplete).toLocaleDateString('vi-VN');
            }
          }

          // Chỉ điền giá trị nếu đây là dòng đầu tiên của khối merge biện pháp khắc phục
          if (recheckIndex === 0) {
            rowData.push(solutionValue);
            rowData.push(noteValue);
            rowData.push(userHandleValue);
            rowData.push(planTimeCompleteValue);
          } else {
            // Để null cho các ô sẽ bị merge
            rowData.push(null);
            rowData.push(null);
            rowData.push(null);
            rowData.push(null);
          }

          // --- Cột Đánh giá khắc phục, Ghi chú (ĐGKPH) (Không merge, mỗi dòng một ĐGKP) ---
          rowData.push(currentRecheck ? currentRecheck.reason || '' : ''); // Đánh giá khắc phục
          rowData.push(currentRecheck ? currentRecheck.note || '' : ''); // Ghi chú (ĐGKPH) (từ recheck.note)

          dataForExport.push(rowData);

          // --- Thêm Merge Cells ---

          // Merge cho Nhóm tiêu chí, Tiêu chí, Tần suất (merge toàn bộ nhóm tiêu chí)
          if (solIndex === 0 && recheckIndex === 0 && totalRowsForThisCriteria > 1) {
            merges.push({
              s: { r: currentRowForData, c: 0 },
              e: { r: currentRowForData + totalRowsForThisCriteria - 1, c: 0 },
            });
            merges.push({
              s: { r: currentRowForData, c: 1 },
              e: { r: currentRowForData + totalRowsForThisCriteria - 1, c: 1 },
            });
            merges.push({
              s: { r: currentRowForData, c: 2 },
              e: { r: currentRowForData + totalRowsForThisCriteria - 1, c: 2 },
            });
            // KHÔNG MERGE CÁC CỘT NGÀY
          }

          // Merge cho Biện pháp khắc phục, Ghi chú, Người thực hiện, Thời gian (merge trong nhóm BPHK)
          if (currentRemedy && effectiveRechecks.length > 1 && recheckIndex === 0) {
            const fixedColsStartIndex = 3 + numberOfDataColumns; // Index 0-based

            merges.push({
              s: { r: currentRowForData, c: fixedColsStartIndex },
              e: { r: currentRowForData + effectiveRechecks.length - 1, c: fixedColsStartIndex },
            });
            merges.push({
              s: { r: currentRowForData, c: fixedColsStartIndex + 1 },
              e: { r: currentRowForData + effectiveRechecks.length - 1, c: fixedColsStartIndex + 1 },
            });
            merges.push({
              s: { r: currentRowForData, c: fixedColsStartIndex + 2 },
              e: { r: currentRowForData + effectiveRechecks.length - 1, c: fixedColsStartIndex + 2 },
            });
            merges.push({
              s: { r: currentRowForData, c: fixedColsStartIndex + 3 },
              e: { r: currentRowForData + effectiveRechecks.length - 1, c: fixedColsStartIndex + 3 },
            });
          }

          currentRowForData++;
        }
      }
    });

    dataForExport.push(['']);
    currentRowForData++;

    if (report.convertScore === 'Bước nhảy') {
      const failRowData: any[] = ['Số lượng không đạt', '', ''];
      const PassRowData: any[] = ['Số lượng đạt', '', ''];
      for (let i = 0; i < numberOfDataColumns; i++) {
        failRowData.push(failCountsPerColumn[i]);
        PassRowData.push(passCountsPerColumn[i]);
      }
      for (let i = 0; i < numberOfNewFixedColumns; i++) {
        failRowData.push('');
        PassRowData.push('');
      }
      dataForExport.push(failRowData);
      dataForExport.push(PassRowData);
      dataForExport.push(['Tổng số lượng không đạt', '', '', totalFail]);
      dataForExport.push(['Tổng số lượng đạt', '', '', totalPass]);
    } else {
      const ncRowData: any[] = ['NC', '', ''];
      const lyRowData: any[] = ['LY', '', ''];
      const scoreRowData: any[] = ['ĐIỂM', '', ''];

      for (let i = 0; i < numberOfDataColumns; i++) {
        ncRowData.push(ncCountsPerColumn[i]);
        lyRowData.push(lyCountsPerColumn[i]);
        scoreRowData.push(ncCountsPerColumn[i] * markNC.mark + lyCountsPerColumn[i] * markLY.mark);
      }
      for (let i = 0; i < numberOfNewFixedColumns; i++) {
        ncRowData.push('');
        lyRowData.push('');
        scoreRowData.push('');
      }

      dataForExport.push(ncRowData);
      dataForExport.push(lyRowData);
      dataForExport.push(scoreRowData);

      dataForExport.push(['']);

      dataForExport.push(['Tổng NC', '', '', totalNC]);
      dataForExport.push(['Tổng LY', '', '', totalLY]);

      const initialScore = parseInt(report.scoreScale || '100', 10);
      const totalDeduction = totalNC * markNC.mark + totalLY * markLY.mark;
      const finalScore = initialScore - totalDeduction;

      dataForExport.push(['Tổng hợp điểm', '', '', finalScore]);
    }

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataForExport);

    const totalColumnsInSheet = 3 + numberOfDataColumns + numberOfNewFixedColumns;
    if (totalColumnsInSheet > 1) {
      merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: totalColumnsInSheet - 1 } });
    }

    merges.push({ s: { r: 8, c: 0 }, e: { r: 8, c: 1 } });
    merges.push({ s: { r: 8, c: 2 }, e: { r: 8, c: 3 } });

    ws['!merges'] = merges;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout: string = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName + excelExtension);
  }
}
