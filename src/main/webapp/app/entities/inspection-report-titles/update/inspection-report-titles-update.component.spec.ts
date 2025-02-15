import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InspectionReportTitlesService } from '../service/inspection-report-titles.service';
import { IInspectionReportTitles } from '../inspection-report-titles.model';
import { InspectionReportTitlesFormService } from './inspection-report-titles-form.service';

import { InspectionReportTitlesUpdateComponent } from './inspection-report-titles-update.component';

describe('InspectionReportTitles Management Update Component', () => {
  let comp: InspectionReportTitlesUpdateComponent;
  let fixture: ComponentFixture<InspectionReportTitlesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let inspectionReportTitlesFormService: InspectionReportTitlesFormService;
  let inspectionReportTitlesService: InspectionReportTitlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), InspectionReportTitlesUpdateComponent],
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
      .overrideTemplate(InspectionReportTitlesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InspectionReportTitlesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    inspectionReportTitlesFormService = TestBed.inject(InspectionReportTitlesFormService);
    inspectionReportTitlesService = TestBed.inject(InspectionReportTitlesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const inspectionReportTitles: IInspectionReportTitles = { id: 456 };

      activatedRoute.data = of({ inspectionReportTitles });
      comp.ngOnInit();

      expect(comp.inspectionReportTitles).toEqual(inspectionReportTitles);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInspectionReportTitles>>();
      const inspectionReportTitles = { id: 123 };
      jest.spyOn(inspectionReportTitlesFormService, 'getInspectionReportTitles').mockReturnValue(inspectionReportTitles);
      jest.spyOn(inspectionReportTitlesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inspectionReportTitles });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: inspectionReportTitles }));
      saveSubject.complete();

      // THEN
      expect(inspectionReportTitlesFormService.getInspectionReportTitles).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(inspectionReportTitlesService.update).toHaveBeenCalledWith(expect.objectContaining(inspectionReportTitles));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInspectionReportTitles>>();
      const inspectionReportTitles = { id: 123 };
      jest.spyOn(inspectionReportTitlesFormService, 'getInspectionReportTitles').mockReturnValue({ id: null });
      jest.spyOn(inspectionReportTitlesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inspectionReportTitles: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: inspectionReportTitles }));
      saveSubject.complete();

      // THEN
      expect(inspectionReportTitlesFormService.getInspectionReportTitles).toHaveBeenCalled();
      expect(inspectionReportTitlesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInspectionReportTitles>>();
      const inspectionReportTitles = { id: 123 };
      jest.spyOn(inspectionReportTitlesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inspectionReportTitles });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(inspectionReportTitlesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
