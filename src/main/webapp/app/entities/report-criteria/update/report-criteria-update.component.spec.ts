import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReportCriteriaService } from '../service/report-criteria.service';
import { IReportCriteria } from '../report-criteria.model';
import { ReportCriteriaFormService } from './report-criteria-form.service';

import { ReportCriteriaUpdateComponent } from './report-criteria-update.component';

describe('ReportCriteria Management Update Component', () => {
  let comp: ReportCriteriaUpdateComponent;
  let fixture: ComponentFixture<ReportCriteriaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reportCriteriaFormService: ReportCriteriaFormService;
  let reportCriteriaService: ReportCriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ReportCriteriaUpdateComponent],
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
      .overrideTemplate(ReportCriteriaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReportCriteriaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reportCriteriaFormService = TestBed.inject(ReportCriteriaFormService);
    reportCriteriaService = TestBed.inject(ReportCriteriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const reportCriteria: IReportCriteria = { id: 456 };

      activatedRoute.data = of({ reportCriteria });
      comp.ngOnInit();

      expect(comp.reportCriteria).toEqual(reportCriteria);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReportCriteria>>();
      const reportCriteria = { id: 123 };
      jest.spyOn(reportCriteriaFormService, 'getReportCriteria').mockReturnValue(reportCriteria);
      jest.spyOn(reportCriteriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reportCriteria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reportCriteria }));
      saveSubject.complete();

      // THEN
      expect(reportCriteriaFormService.getReportCriteria).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(reportCriteriaService.update).toHaveBeenCalledWith(expect.objectContaining(reportCriteria));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReportCriteria>>();
      const reportCriteria = { id: 123 };
      jest.spyOn(reportCriteriaFormService, 'getReportCriteria').mockReturnValue({ id: null });
      jest.spyOn(reportCriteriaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reportCriteria: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reportCriteria }));
      saveSubject.complete();

      // THEN
      expect(reportCriteriaFormService.getReportCriteria).toHaveBeenCalled();
      expect(reportCriteriaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReportCriteria>>();
      const reportCriteria = { id: 123 };
      jest.spyOn(reportCriteriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reportCriteria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reportCriteriaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
