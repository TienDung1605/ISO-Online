import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReportTitleService } from '../service/report-title.service';
import { IReportTitle } from '../report-title.model';
import { ReportTitleFormService } from './report-title-form.service';

import { ReportTitleUpdateComponent } from './report-title-update.component';

describe('ReportTitle Management Update Component', () => {
  let comp: ReportTitleUpdateComponent;
  let fixture: ComponentFixture<ReportTitleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reportTitleFormService: ReportTitleFormService;
  let reportTitleService: ReportTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ReportTitleUpdateComponent],
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
      .overrideTemplate(ReportTitleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReportTitleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reportTitleFormService = TestBed.inject(ReportTitleFormService);
    reportTitleService = TestBed.inject(ReportTitleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const reportTitle: IReportTitle = { id: 456 };

      activatedRoute.data = of({ reportTitle });
      comp.ngOnInit();

      expect(comp.reportTitle).toEqual(reportTitle);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReportTitle>>();
      const reportTitle = { id: 123 };
      jest.spyOn(reportTitleFormService, 'getReportTitle').mockReturnValue(reportTitle);
      jest.spyOn(reportTitleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reportTitle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reportTitle }));
      saveSubject.complete();

      // THEN
      expect(reportTitleFormService.getReportTitle).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(reportTitleService.update).toHaveBeenCalledWith(expect.objectContaining(reportTitle));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReportTitle>>();
      const reportTitle = { id: 123 };
      jest.spyOn(reportTitleFormService, 'getReportTitle').mockReturnValue({ id: null });
      jest.spyOn(reportTitleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reportTitle: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reportTitle }));
      saveSubject.complete();

      // THEN
      expect(reportTitleFormService.getReportTitle).toHaveBeenCalled();
      expect(reportTitleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReportTitle>>();
      const reportTitle = { id: 123 };
      jest.spyOn(reportTitleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reportTitle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reportTitleService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
