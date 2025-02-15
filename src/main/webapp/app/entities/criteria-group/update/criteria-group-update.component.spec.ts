import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CriteriaGroupService } from '../service/criteria-group.service';
import { ICriteriaGroup } from '../criteria-group.model';
import { CriteriaGroupFormService } from './criteria-group-form.service';

import { CriteriaGroupUpdateComponent } from './criteria-group-update.component';

describe('CriteriaGroup Management Update Component', () => {
  let comp: CriteriaGroupUpdateComponent;
  let fixture: ComponentFixture<CriteriaGroupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let criteriaGroupFormService: CriteriaGroupFormService;
  let criteriaGroupService: CriteriaGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CriteriaGroupUpdateComponent],
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
      .overrideTemplate(CriteriaGroupUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriteriaGroupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    criteriaGroupFormService = TestBed.inject(CriteriaGroupFormService);
    criteriaGroupService = TestBed.inject(CriteriaGroupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const criteriaGroup: ICriteriaGroup = { id: 456 };

      activatedRoute.data = of({ criteriaGroup });
      comp.ngOnInit();

      expect(comp.criteriaGroup).toEqual(criteriaGroup);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaGroup>>();
      const criteriaGroup = { id: 123 };
      jest.spyOn(criteriaGroupFormService, 'getCriteriaGroup').mockReturnValue(criteriaGroup);
      jest.spyOn(criteriaGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaGroup }));
      saveSubject.complete();

      // THEN
      expect(criteriaGroupFormService.getCriteriaGroup).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(criteriaGroupService.update).toHaveBeenCalledWith(expect.objectContaining(criteriaGroup));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaGroup>>();
      const criteriaGroup = { id: 123 };
      jest.spyOn(criteriaGroupFormService, 'getCriteriaGroup').mockReturnValue({ id: null });
      jest.spyOn(criteriaGroupService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaGroup: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaGroup }));
      saveSubject.complete();

      // THEN
      expect(criteriaGroupFormService.getCriteriaGroup).toHaveBeenCalled();
      expect(criteriaGroupService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaGroup>>();
      const criteriaGroup = { id: 123 };
      jest.spyOn(criteriaGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(criteriaGroupService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
