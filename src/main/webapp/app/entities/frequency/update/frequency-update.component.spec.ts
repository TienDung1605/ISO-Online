import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FrequencyService } from '../service/frequency.service';
import { IFrequency } from '../frequency.model';
import { FrequencyFormService } from './frequency-form.service';

import { FrequencyUpdateComponent } from './frequency-update.component';

describe('Frequency Management Update Component', () => {
  let comp: FrequencyUpdateComponent;
  let fixture: ComponentFixture<FrequencyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let frequencyFormService: FrequencyFormService;
  let frequencyService: FrequencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), FrequencyUpdateComponent],
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
      .overrideTemplate(FrequencyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FrequencyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    frequencyFormService = TestBed.inject(FrequencyFormService);
    frequencyService = TestBed.inject(FrequencyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const frequency: IFrequency = { id: 456 };

      activatedRoute.data = of({ frequency });
      comp.ngOnInit();

      expect(comp.frequency).toEqual(frequency);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFrequency>>();
      const frequency = { id: 123 };
      jest.spyOn(frequencyFormService, 'getFrequency').mockReturnValue(frequency);
      jest.spyOn(frequencyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ frequency });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: frequency }));
      saveSubject.complete();

      // THEN
      expect(frequencyFormService.getFrequency).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(frequencyService.update).toHaveBeenCalledWith(expect.objectContaining(frequency));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFrequency>>();
      const frequency = { id: 123 };
      jest.spyOn(frequencyFormService, 'getFrequency').mockReturnValue({ id: null });
      jest.spyOn(frequencyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ frequency: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: frequency }));
      saveSubject.complete();

      // THEN
      expect(frequencyFormService.getFrequency).toHaveBeenCalled();
      expect(frequencyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFrequency>>();
      const frequency = { id: 123 };
      jest.spyOn(frequencyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ frequency });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(frequencyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
