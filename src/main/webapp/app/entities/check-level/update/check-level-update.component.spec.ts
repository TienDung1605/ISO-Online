import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CheckLevelService } from '../service/check-level.service';
import { ICheckLevel } from '../check-level.model';
import { CheckLevelFormService } from './check-level-form.service';

import { CheckLevelUpdateComponent } from './check-level-update.component';

describe('CheckLevel Management Update Component', () => {
  let comp: CheckLevelUpdateComponent;
  let fixture: ComponentFixture<CheckLevelUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let checkLevelFormService: CheckLevelFormService;
  let checkLevelService: CheckLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CheckLevelUpdateComponent],
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
      .overrideTemplate(CheckLevelUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CheckLevelUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    checkLevelFormService = TestBed.inject(CheckLevelFormService);
    checkLevelService = TestBed.inject(CheckLevelService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const checkLevel: ICheckLevel = { id: 456 };

      activatedRoute.data = of({ checkLevel });
      comp.ngOnInit();

      expect(comp.checkLevel).toEqual(checkLevel);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckLevel>>();
      const checkLevel = { id: 123 };
      jest.spyOn(checkLevelFormService, 'getCheckLevel').mockReturnValue(checkLevel);
      jest.spyOn(checkLevelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkLevel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: checkLevel }));
      saveSubject.complete();

      // THEN
      expect(checkLevelFormService.getCheckLevel).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(checkLevelService.update).toHaveBeenCalledWith(expect.objectContaining(checkLevel));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckLevel>>();
      const checkLevel = { id: 123 };
      jest.spyOn(checkLevelFormService, 'getCheckLevel').mockReturnValue({ id: null });
      jest.spyOn(checkLevelService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkLevel: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: checkLevel }));
      saveSubject.complete();

      // THEN
      expect(checkLevelFormService.getCheckLevel).toHaveBeenCalled();
      expect(checkLevelService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckLevel>>();
      const checkLevel = { id: 123 };
      jest.spyOn(checkLevelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkLevel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(checkLevelService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
