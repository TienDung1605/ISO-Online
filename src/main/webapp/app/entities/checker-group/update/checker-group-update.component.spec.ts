import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CheckerGroupService } from '../service/checker-group.service';
import { ICheckerGroup } from '../checker-group.model';
import { CheckerGroupFormService } from './checker-group-form.service';

import { CheckerGroupUpdateComponent } from './checker-group-update.component';

describe('CheckerGroup Management Update Component', () => {
  let comp: CheckerGroupUpdateComponent;
  let fixture: ComponentFixture<CheckerGroupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let checkerGroupFormService: CheckerGroupFormService;
  let checkerGroupService: CheckerGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CheckerGroupUpdateComponent],
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
      .overrideTemplate(CheckerGroupUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CheckerGroupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    checkerGroupFormService = TestBed.inject(CheckerGroupFormService);
    checkerGroupService = TestBed.inject(CheckerGroupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const checkerGroup: ICheckerGroup = { id: 456 };

      activatedRoute.data = of({ checkerGroup });
      comp.ngOnInit();

      expect(comp.checkerGroup).toEqual(checkerGroup);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckerGroup>>();
      const checkerGroup = { id: 123 };
      jest.spyOn(checkerGroupFormService, 'getCheckerGroup').mockReturnValue(checkerGroup);
      jest.spyOn(checkerGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkerGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: checkerGroup }));
      saveSubject.complete();

      // THEN
      expect(checkerGroupFormService.getCheckerGroup).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(checkerGroupService.update).toHaveBeenCalledWith(expect.objectContaining(checkerGroup));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckerGroup>>();
      const checkerGroup = { id: 123 };
      jest.spyOn(checkerGroupFormService, 'getCheckerGroup').mockReturnValue({ id: null });
      jest.spyOn(checkerGroupService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkerGroup: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: checkerGroup }));
      saveSubject.complete();

      // THEN
      expect(checkerGroupFormService.getCheckerGroup).toHaveBeenCalled();
      expect(checkerGroupService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckerGroup>>();
      const checkerGroup = { id: 123 };
      jest.spyOn(checkerGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkerGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(checkerGroupService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
