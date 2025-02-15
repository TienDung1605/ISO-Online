import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITitle } from '../title.model';
import { TitleService } from '../service/title.service';
import { TitleFormService, TitleFormGroup } from './title-form.service';

@Component({
  standalone: true,
  selector: 'jhi-title-update',
  templateUrl: './title-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TitleUpdateComponent implements OnInit {
  isSaving = false;
  title: ITitle | null = null;

  protected titleService = inject(TitleService);
  protected titleFormService = inject(TitleFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TitleFormGroup = this.titleFormService.createTitleFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ title }) => {
      this.title = title;
      if (title) {
        this.updateForm(title);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const title = this.titleFormService.getTitle(this.editForm);
    if (title.id !== null) {
      this.subscribeToSaveResponse(this.titleService.update(title));
    } else {
      this.subscribeToSaveResponse(this.titleService.create(title));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITitle>>): void {
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

  protected updateForm(title: ITitle): void {
    this.title = title;
    this.titleFormService.resetForm(this.editForm, title);
  }
}
