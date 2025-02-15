import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ScriptService } from '../service/script.service';
import { IScript } from '../script.model';
import { ScriptFormService } from './script-form.service';

import { ScriptUpdateComponent } from './script-update.component';

describe('Script Management Update Component', () => {
  let comp: ScriptUpdateComponent;
  let fixture: ComponentFixture<ScriptUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let scriptFormService: ScriptFormService;
  let scriptService: ScriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ScriptUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ScriptUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ScriptUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    scriptFormService = TestBed.inject(ScriptFormService);
    scriptService = TestBed.inject(ScriptService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const script: IScript = { id: 456 };

      activatedRoute.data = of({ script });
      comp.ngOnInit();

      expect(comp.script).toEqual(script);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScript>>();
      const script = { id: 123 };
      jest.spyOn(scriptFormService, 'getScript').mockReturnValue(script);
      jest.spyOn(scriptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ script });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: script }));
      saveSubject.complete();

      // THEN
      expect(scriptFormService.getScript).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(scriptService.update).toHaveBeenCalledWith(expect.objectContaining(script));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScript>>();
      const script = { id: 123 };
      jest.spyOn(scriptFormService, 'getScript').mockReturnValue({ id: null });
      jest.spyOn(scriptService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ script: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: script }));
      saveSubject.complete();

      // THEN
      expect(scriptFormService.getScript).toHaveBeenCalled();
      expect(scriptService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScript>>();
      const script = { id: 123 };
      jest.spyOn(scriptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ script });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(scriptService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
