import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CriteriaService } from '../service/criteria.service';
import { ICriteria } from '../criteria.model';
import { CriteriaFormService } from './criteria-form.service';

import { CriteriaUpdateComponent } from './criteria-update.component';

describe('Criteria Management Update Component', () => {
  let comp: CriteriaUpdateComponent;
  let fixture: ComponentFixture<CriteriaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let criteriaFormService: CriteriaFormService;
  let criteriaService: CriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CriteriaUpdateComponent],
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
      .overrideTemplate(CriteriaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriteriaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    criteriaFormService = TestBed.inject(CriteriaFormService);
    criteriaService = TestBed.inject(CriteriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const criteria: ICriteria = { id: 456 };

      activatedRoute.data = of({ criteria });
      comp.ngOnInit();

      expect(comp.criteria).toEqual(criteria);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteria>>();
      const criteria = { id: 123 };
      jest.spyOn(criteriaFormService, 'getCriteria').mockReturnValue(criteria);
      jest.spyOn(criteriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteria }));
      saveSubject.complete();

      // THEN
      expect(criteriaFormService.getCriteria).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(criteriaService.update).toHaveBeenCalledWith(expect.objectContaining(criteria));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteria>>();
      const criteria = { id: 123 };
      jest.spyOn(criteriaFormService, 'getCriteria').mockReturnValue({ id: null });
      jest.spyOn(criteriaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteria: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteria }));
      saveSubject.complete();

      // THEN
      expect(criteriaFormService.getCriteria).toHaveBeenCalled();
      expect(criteriaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteria>>();
      const criteria = { id: 123 };
      jest.spyOn(criteriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(criteriaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
