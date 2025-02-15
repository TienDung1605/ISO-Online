import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PartsService } from '../service/parts.service';
import { IParts } from '../parts.model';
import { PartsFormService } from './parts-form.service';

import { PartsUpdateComponent } from './parts-update.component';

describe('Parts Management Update Component', () => {
  let comp: PartsUpdateComponent;
  let fixture: ComponentFixture<PartsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let partsFormService: PartsFormService;
  let partsService: PartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PartsUpdateComponent],
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
      .overrideTemplate(PartsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PartsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    partsFormService = TestBed.inject(PartsFormService);
    partsService = TestBed.inject(PartsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const parts: IParts = { id: 456 };

      activatedRoute.data = of({ parts });
      comp.ngOnInit();

      expect(comp.parts).toEqual(parts);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParts>>();
      const parts = { id: 123 };
      jest.spyOn(partsFormService, 'getParts').mockReturnValue(parts);
      jest.spyOn(partsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parts }));
      saveSubject.complete();

      // THEN
      expect(partsFormService.getParts).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(partsService.update).toHaveBeenCalledWith(expect.objectContaining(parts));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParts>>();
      const parts = { id: 123 };
      jest.spyOn(partsFormService, 'getParts').mockReturnValue({ id: null });
      jest.spyOn(partsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parts: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parts }));
      saveSubject.complete();

      // THEN
      expect(partsFormService.getParts).toHaveBeenCalled();
      expect(partsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParts>>();
      const parts = { id: 123 };
      jest.spyOn(partsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(partsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
