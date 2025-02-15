import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CheckTargetService } from '../service/check-target.service';
import { ICheckTarget } from '../check-target.model';
import { CheckTargetFormService } from './check-target-form.service';

import { CheckTargetUpdateComponent } from './check-target-update.component';

describe('CheckTarget Management Update Component', () => {
  let comp: CheckTargetUpdateComponent;
  let fixture: ComponentFixture<CheckTargetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let checkTargetFormService: CheckTargetFormService;
  let checkTargetService: CheckTargetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CheckTargetUpdateComponent],
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
      .overrideTemplate(CheckTargetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CheckTargetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    checkTargetFormService = TestBed.inject(CheckTargetFormService);
    checkTargetService = TestBed.inject(CheckTargetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const checkTarget: ICheckTarget = { id: 456 };

      activatedRoute.data = of({ checkTarget });
      comp.ngOnInit();

      expect(comp.checkTarget).toEqual(checkTarget);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckTarget>>();
      const checkTarget = { id: 123 };
      jest.spyOn(checkTargetFormService, 'getCheckTarget').mockReturnValue(checkTarget);
      jest.spyOn(checkTargetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkTarget });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: checkTarget }));
      saveSubject.complete();

      // THEN
      expect(checkTargetFormService.getCheckTarget).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(checkTargetService.update).toHaveBeenCalledWith(expect.objectContaining(checkTarget));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckTarget>>();
      const checkTarget = { id: 123 };
      jest.spyOn(checkTargetFormService, 'getCheckTarget').mockReturnValue({ id: null });
      jest.spyOn(checkTargetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkTarget: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: checkTarget }));
      saveSubject.complete();

      // THEN
      expect(checkTargetFormService.getCheckTarget).toHaveBeenCalled();
      expect(checkTargetService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckTarget>>();
      const checkTarget = { id: 123 };
      jest.spyOn(checkTargetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkTarget });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(checkTargetService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
