import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISampleReport } from '../sample-report.model';
import { SampleReportService } from '../service/sample-report.service';
import { SampleReportFormService, SampleReportFormGroup } from './sample-report-form.service';

interface IColumn {
  header: string;
  field: string;
  type: string;
  position: string;
}
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';

@Component({
  standalone: true,
  selector: 'jhi-sample-report-update',
  templateUrl: './sample-report-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, TableModule, IconFieldModule, InputIconModule, TagModule],
})
export class SampleReportUpdateComponent implements OnInit {
  isSaving = false;
  sampleReport: ISampleReport | null = null;

  columns: any[] = [
    {
      header: '',
      field: '',
      type: '',
      required: '',
      value: '',
    },
  ];
  protected sampleReportService = inject(SampleReportService);
  protected sampleReportFormService = inject(SampleReportFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected column: IColumn[] = [];

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SampleReportFormGroup = this.sampleReportFormService.createSampleReportFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sampleReport }) => {
      this.sampleReport = sampleReport;
      if (sampleReport) {
        this.updateForm(sampleReport);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sampleReport = this.sampleReportFormService.getSampleReport(this.editForm);
    if (sampleReport.id !== null) {
      this.subscribeToSaveResponse(this.sampleReportService.update(sampleReport));
    } else {
      this.subscribeToSaveResponse(this.sampleReportService.create(sampleReport));
    }
  }

  // async openColumnModal(): Promise<void> {

  //   const rowsData = [{
  //     header: '',
  //     field: '',
  //     position: '',
  //     type: 'text'
  //   }];
  //   let rowCount = this.columns.length;
  //   const { value: formValues } = await Swal.fire({
  //     title: 'Quản lý tiêu đề mẫu BBKT',
  //     width: '80%',
  //     customClass: {
  //       container: 'large-modal',
  //       popup: 'large-modal-popup'
  //     },
  //     html: `
  //     <button id="addRow" class="btn btn-primary mt-2">Thêm dòng</button>
  //       <table class="swal2-table">
  //       <thead>
  //         <tr>
  //           <th class="text-center border">STT</th>
  //           <th class="text-center border">Tên tiêu đề</th>
  //           <th class="text-center border">Danh mục</th>
  //           <th class="text-center border">Vị trí</th>
  //           <th class="text-center border">Kiểu dữ liệu</th>
  //           <th class="text-center border">Tuỳ chọn</th>
  //         </tr>
  //         </thead>
  //         ${this.columns.map((column, index) => `
  //         <tbody id="tableBody">
  //         <tr>
  //           <td class="text-center border">${index + 1}</td>
  //           <td class="text-center border"><input id="header" class="swal2-input" placeholder="Tên tiêu đề"></td>
  //           <td class="text-center border"><input id="field" class="swal2-input" placeholder="Danh mục"></td>
  //           <td class="text-center border"><input id="position" class="swal2-input" type="number" placeholder="Vị trí"></td>
  //           <td class="text-center border">
  //             <select id="type-${index}" class="swal2-select">
  //               <option value="text" ${column.type === 'text' ? 'selected' : ''}>Text</option>
  //               <option value="number" ${column.type === 'number' ? 'selected' : ''}>Number</option>
  //               <option value="date" ${column.type === 'date' ? 'selected' : ''}>Date</option>
  //             </select>
  //           </td>
  //           <td class="text-center border">
  //             <button class="btn btn-danger" onclick="deleteRow(${index})">Xoá</button>
  //           </td>
  //         </tr>
  //         </tbody>
  //          `).join('')}
  //       </table>
  //     `,
  //     didOpen() {
  //       document.getElementById('addRow')?.addEventListener('click', () => {
  //         const tbody = document.getElementById('tableBody');
  //         if (tbody) {
  //           const newRow = generateTableRow(rowCount);
  //           tbody.insertAdjacentHTML('beforeend', newRow);
  //           rowCount++;
  //         }
  //       });

  //       (window as any).deleteRow = (index: number) => {
  //         const row = document.querySelector(`tr[data-index="${index}"]`);
  //         if (row) {
  //           row.remove();
  //           const rows = document.querySelectorAll('#tableBody tr');
  //           rows.forEach((currentRow, idx) => {
  //             const firstCell = currentRow.querySelector('td:first-child');
  //             if (firstCell) {
  //               firstCell.textContent = (idx + 1).toString();
  //             }
  //           });
  //         }
  //       };
  //     },
  //     focusConfirm: false,
  //     showCancelButton: true,
  //     confirmButtonText: 'Lưu',
  //     cancelButtonText: 'Hủy',
  //     preConfirm() {
  //       const rows = document.querySelectorAll('#tableBody tr');
  //       const newColumns: IColumn[] = [];
  //       rows.forEach((row, index) => {
  //         const header = (row.querySelector(`#header-${index}`) as HTMLInputElement)?.value;
  //         const field = (row.querySelector(`#field-${index}`) as HTMLInputElement)?.value;
  //         const position = (row.querySelector(`#position-${index}`) as HTMLInputElement)?.value;
  //         const type = (row.querySelector(`#type-${index}`) as HTMLSelectElement)?.value;

  //         if (!header || !field) {
  //           Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin cho tất cả các dòng');
  //           return false;
  //         }

  //         newColumns.push({
  //           header,
  //           field,
  //           position,
  //           type: type || 'text'
  //         });
  //       });

  //       return newColumns;
  //     }
  //   });

  //   if (formValues) {
  //     this.columns = formValues;
  //     this.editForm.patchValue({ columns: this.columns });
  //   }
  // }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISampleReport>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(sampleReport: ISampleReport): void {
    this.sampleReport = sampleReport;
    this.sampleReportFormService.resetForm(this.editForm, sampleReport);
  }
}
// function generateTableRow(rowCount: any):any {
//   throw new Error('Function not implemented.');
// }
// let rowCount = 1;

// function generateTableRow(index: number): string {
//   return `
//     <tr data-index="${index}">
//       <td class="text-center border">${index + 1}</td>
//       <td class="text-center border"><input id="header-${index}" class="swal2-input" placeholder="Tên tiêu đề"></td>
//       <td class="text-center border"><input id="field-${index}" class="swal2-input" placeholder="Danh mục"></td>
//       <td class="text-center border"><input id="position-${index}" class="swal2-input" type="number" placeholder="Vị trí"></td>
//       <td class="text-center border">
//         <select id="type-${index}" class="swal2-select">
//           <option value="text">Text</option>
//           <option value="number">Number</option>
//           <option value="date">Date</option>
//         </select>
//       </td>
//       <td class="text-center border">
//         <button class="btn btn-danger" onclick="deleteRow(${index})">Xoá</button>
//       </td>
//     </tr>
//   `;
// }
