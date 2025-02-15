import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SampleReportCriteriaService } from '../service/sample-report-criteria.service';
import { ISampleReportCriteria } from '../sample-report-criteria.model';
import { SampleReportCriteriaFormService } from './sample-report-criteria-form.service';

import { SampleReportCriteriaUpdateComponent } from './sample-report-criteria-update.component';

describe('SampleReportCriteria Management Update Component', () => {
  let comp: SampleReportCriteriaUpdateComponent;
  let fixture: ComponentFixture<SampleReportCriteriaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sampleReportCriteriaFormService: SampleReportCriteriaFormService;
  let sampleReportCriteriaService: SampleReportCriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SampleReportCriteriaUpdateComponent],
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
      .overrideTemplate(SampleReportCriteriaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SampleReportCriteriaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sampleReportCriteriaFormService = TestBed.inject(SampleReportCriteriaFormService);
    sampleReportCriteriaService = TestBed.inject(SampleReportCriteriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sampleReportCriteria: ISampleReportCriteria = { id: 456 };

      activatedRoute.data = of({ sampleReportCriteria });
      comp.ngOnInit();

      expect(comp.sampleReportCriteria).toEqual(sampleReportCriteria);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISampleReportCriteria>>();
      const sampleReportCriteria = { id: 123 };
      jest.spyOn(sampleReportCriteriaFormService, 'getSampleReportCriteria').mockReturnValue(sampleReportCriteria);
      jest.spyOn(sampleReportCriteriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sampleReportCriteria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sampleReportCriteria }));
      saveSubject.complete();

      // THEN
      expect(sampleReportCriteriaFormService.getSampleReportCriteria).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sampleReportCriteriaService.update).toHaveBeenCalledWith(expect.objectContaining(sampleReportCriteria));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISampleReportCriteria>>();
      const sampleReportCriteria = { id: 123 };
      jest.spyOn(sampleReportCriteriaFormService, 'getSampleReportCriteria').mockReturnValue({ id: null });
      jest.spyOn(sampleReportCriteriaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sampleReportCriteria: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sampleReportCriteria }));
      saveSubject.complete();

      // THEN
      expect(sampleReportCriteriaFormService.getSampleReportCriteria).toHaveBeenCalled();
      expect(sampleReportCriteriaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISampleReportCriteria>>();
      const sampleReportCriteria = { id: 123 };
      jest.spyOn(sampleReportCriteriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sampleReportCriteria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sampleReportCriteriaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
