import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SampleReportService } from '../service/sample-report.service';
import { ISampleReport } from '../sample-report.model';
import { SampleReportFormService } from './sample-report-form.service';

import { SampleReportUpdateComponent } from './sample-report-update.component';

describe('SampleReport Management Update Component', () => {
  let comp: SampleReportUpdateComponent;
  let fixture: ComponentFixture<SampleReportUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sampleReportFormService: SampleReportFormService;
  let sampleReportService: SampleReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SampleReportUpdateComponent],
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
      .overrideTemplate(SampleReportUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SampleReportUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sampleReportFormService = TestBed.inject(SampleReportFormService);
    sampleReportService = TestBed.inject(SampleReportService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sampleReport: ISampleReport = { id: 456 };

      activatedRoute.data = of({ sampleReport });
      comp.ngOnInit();

      expect(comp.sampleReport).toEqual(sampleReport);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISampleReport>>();
      const sampleReport = { id: 123 };
      jest.spyOn(sampleReportFormService, 'getSampleReport').mockReturnValue(sampleReport);
      jest.spyOn(sampleReportService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sampleReport });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sampleReport }));
      saveSubject.complete();

      // THEN
      expect(sampleReportFormService.getSampleReport).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sampleReportService.update).toHaveBeenCalledWith(expect.objectContaining(sampleReport));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISampleReport>>();
      const sampleReport = { id: 123 };
      jest.spyOn(sampleReportFormService, 'getSampleReport').mockReturnValue({ id: null });
      jest.spyOn(sampleReportService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sampleReport: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sampleReport }));
      saveSubject.complete();

      // THEN
      expect(sampleReportFormService.getSampleReport).toHaveBeenCalled();
      expect(sampleReportService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISampleReport>>();
      const sampleReport = { id: 123 };
      jest.spyOn(sampleReportService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sampleReport });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sampleReportService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
