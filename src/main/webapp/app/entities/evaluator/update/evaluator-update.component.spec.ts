import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EvaluatorService } from '../service/evaluator.service';
import { IEvaluator } from '../evaluator.model';
import { EvaluatorFormService } from './evaluator-form.service';

import { EvaluatorUpdateComponent } from './evaluator-update.component';

describe('Evaluator Management Update Component', () => {
  let comp: EvaluatorUpdateComponent;
  let fixture: ComponentFixture<EvaluatorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let evaluatorFormService: EvaluatorFormService;
  let evaluatorService: EvaluatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), EvaluatorUpdateComponent],
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
      .overrideTemplate(EvaluatorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EvaluatorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    evaluatorFormService = TestBed.inject(EvaluatorFormService);
    evaluatorService = TestBed.inject(EvaluatorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const evaluator: IEvaluator = { id: 456 };

      activatedRoute.data = of({ evaluator });
      comp.ngOnInit();

      expect(comp.evaluator).toEqual(evaluator);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvaluator>>();
      const evaluator = { id: 123 };
      jest.spyOn(evaluatorFormService, 'getEvaluator').mockReturnValue(evaluator);
      jest.spyOn(evaluatorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ evaluator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: evaluator }));
      saveSubject.complete();

      // THEN
      expect(evaluatorFormService.getEvaluator).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(evaluatorService.update).toHaveBeenCalledWith(expect.objectContaining(evaluator));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvaluator>>();
      const evaluator = { id: 123 };
      jest.spyOn(evaluatorFormService, 'getEvaluator').mockReturnValue({ id: null });
      jest.spyOn(evaluatorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ evaluator: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: evaluator }));
      saveSubject.complete();

      // THEN
      expect(evaluatorFormService.getEvaluator).toHaveBeenCalled();
      expect(evaluatorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvaluator>>();
      const evaluator = { id: 123 };
      jest.spyOn(evaluatorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ evaluator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(evaluatorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
