import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PlanService } from '../service/plan.service';
import { IPlan } from '../plan.model';
import { PlanFormService } from './plan-form.service';

import { PlanUpdateComponent } from './plan-update.component';

describe('Plan Management Update Component', () => {
  let comp: PlanUpdateComponent;
  let fixture: ComponentFixture<PlanUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let planFormService: PlanFormService;
  let planService: PlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PlanUpdateComponent],
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
      .overrideTemplate(PlanUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlanUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    planFormService = TestBed.inject(PlanFormService);
    planService = TestBed.inject(PlanService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const plan: IPlan = { id: 456 };

      activatedRoute.data = of({ plan });
      comp.ngOnInit();

      expect(comp.plan).toEqual(plan);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlan>>();
      const plan = { id: 123 };
      jest.spyOn(planFormService, 'getPlan').mockReturnValue(plan);
      jest.spyOn(planService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plan }));
      saveSubject.complete();

      // THEN
      expect(planFormService.getPlan).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(planService.update).toHaveBeenCalledWith(expect.objectContaining(plan));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlan>>();
      const plan = { id: 123 };
      jest.spyOn(planFormService, 'getPlan').mockReturnValue({ id: null });
      jest.spyOn(planService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plan: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plan }));
      saveSubject.complete();

      // THEN
      expect(planFormService.getPlan).toHaveBeenCalled();
      expect(planService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlan>>();
      const plan = { id: 123 };
      jest.spyOn(planService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(planService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
