import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IInspectionReportTitles } from '../inspection-report-titles.model';
import { InspectionReportTitlesService } from '../service/inspection-report-titles.service';

import inspectionReportTitlesResolve from './inspection-report-titles-routing-resolve.service';

describe('InspectionReportTitles routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: InspectionReportTitlesService;
  let resultInspectionReportTitles: IInspectionReportTitles | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(InspectionReportTitlesService);
    resultInspectionReportTitles = undefined;
  });

  describe('resolve', () => {
    it('should return IInspectionReportTitles returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        inspectionReportTitlesResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultInspectionReportTitles = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultInspectionReportTitles).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        inspectionReportTitlesResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultInspectionReportTitles = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultInspectionReportTitles).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IInspectionReportTitles>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        inspectionReportTitlesResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultInspectionReportTitles = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultInspectionReportTitles).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
