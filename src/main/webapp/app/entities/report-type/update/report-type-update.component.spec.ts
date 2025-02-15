import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReportTypeService } from '../service/report-type.service';
import { IReportType } from '../report-type.model';
import { ReportTypeFormService } from './report-type-form.service';

import { ReportTypeUpdateComponent } from './report-type-update.component';

describe('ReportType Management Update Component', () => {
  let comp: ReportTypeUpdateComponent;
  let fixture: ComponentFixture<ReportTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reportTypeFormService: ReportTypeFormService;
  let reportTypeService: ReportTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ReportTypeUpdateComponent],
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
      .overrideTemplate(ReportTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReportTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reportTypeFormService = TestBed.inject(ReportTypeFormService);
    reportTypeService = TestBed.inject(ReportTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const reportType: IReportType = { id: 456 };

      activatedRoute.data = of({ reportType });
      comp.ngOnInit();

      expect(comp.reportType).toEqual(reportType);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReportType>>();
      const reportType = { id: 123 };
      jest.spyOn(reportTypeFormService, 'getReportType').mockReturnValue(reportType);
      jest.spyOn(reportTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reportType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reportType }));
      saveSubject.complete();

      // THEN
      expect(reportTypeFormService.getReportType).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(reportTypeService.update).toHaveBeenCalledWith(expect.objectContaining(reportType));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReportType>>();
      const reportType = { id: 123 };
      jest.spyOn(reportTypeFormService, 'getReportType').mockReturnValue({ id: null });
      jest.spyOn(reportTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reportType: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reportType }));
      saveSubject.complete();

      // THEN
      expect(reportTypeFormService.getReportType).toHaveBeenCalled();
      expect(reportTypeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReportType>>();
      const reportType = { id: 123 };
      jest.spyOn(reportTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reportType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reportTypeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
