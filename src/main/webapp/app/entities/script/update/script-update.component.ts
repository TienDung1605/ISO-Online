import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IScript } from '../script.model';
import { ScriptService } from '../service/script.service';
import { ScriptFormService, ScriptFormGroup } from './script-form.service';

@Component({
  standalone: true,
  selector: 'jhi-script-update',
  templateUrl: './script-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ScriptUpdateComponent implements OnInit {
  isSaving = false;
  script: IScript | null = null;

  protected scriptService = inject(ScriptService);
  protected scriptFormService = inject(ScriptFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ScriptFormGroup = this.scriptFormService.createScriptFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ script }) => {
      this.script = script;
      if (script) {
        this.updateForm(script);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const script = this.scriptFormService.getScript(this.editForm);
    if (script.id !== null) {
      this.subscribeToSaveResponse(this.scriptService.update(script));
    } else {
      this.subscribeToSaveResponse(this.scriptService.create(script));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IScript>>): void {
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

  protected updateForm(script: IScript): void {
    this.script = script;
    this.scriptFormService.resetForm(this.editForm, script);
  }
}
