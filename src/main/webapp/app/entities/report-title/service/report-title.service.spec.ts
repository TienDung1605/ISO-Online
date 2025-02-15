import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReportTitle } from '../report-title.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../report-title.test-samples';

import { ReportTitleService, RestReportTitle } from './report-title.service';

const requireRestSample: RestReportTitle = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('ReportTitle Service', () => {
  let service: ReportTitleService;
  let httpMock: HttpTestingController;
  let expectedResult: IReportTitle | IReportTitle[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReportTitleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ReportTitle', () => {
      const reportTitle = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(reportTitle).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ReportTitle', () => {
      const reportTitle = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(reportTitle).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ReportTitle', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ReportTitle', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ReportTitle', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addReportTitleToCollectionIfMissing', () => {
      it('should add a ReportTitle to an empty array', () => {
        const reportTitle: IReportTitle = sampleWithRequiredData;
        expectedResult = service.addReportTitleToCollectionIfMissing([], reportTitle);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reportTitle);
      });

      it('should not add a ReportTitle to an array that contains it', () => {
        const reportTitle: IReportTitle = sampleWithRequiredData;
        const reportTitleCollection: IReportTitle[] = [
          {
            ...reportTitle,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addReportTitleToCollectionIfMissing(reportTitleCollection, reportTitle);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ReportTitle to an array that doesn't contain it", () => {
        const reportTitle: IReportTitle = sampleWithRequiredData;
        const reportTitleCollection: IReportTitle[] = [sampleWithPartialData];
        expectedResult = service.addReportTitleToCollectionIfMissing(reportTitleCollection, reportTitle);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reportTitle);
      });

      it('should add only unique ReportTitle to an array', () => {
        const reportTitleArray: IReportTitle[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const reportTitleCollection: IReportTitle[] = [sampleWithRequiredData];
        expectedResult = service.addReportTitleToCollectionIfMissing(reportTitleCollection, ...reportTitleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reportTitle: IReportTitle = sampleWithRequiredData;
        const reportTitle2: IReportTitle = sampleWithPartialData;
        expectedResult = service.addReportTitleToCollectionIfMissing([], reportTitle, reportTitle2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reportTitle);
        expect(expectedResult).toContain(reportTitle2);
      });

      it('should accept null and undefined values', () => {
        const reportTitle: IReportTitle = sampleWithRequiredData;
        expectedResult = service.addReportTitleToCollectionIfMissing([], null, reportTitle, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reportTitle);
      });

      it('should return initial array if no ReportTitle is added', () => {
        const reportTitleCollection: IReportTitle[] = [sampleWithRequiredData];
        expectedResult = service.addReportTitleToCollectionIfMissing(reportTitleCollection, undefined, null);
        expect(expectedResult).toEqual(reportTitleCollection);
      });
    });

    describe('compareReportTitle', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareReportTitle(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareReportTitle(entity1, entity2);
        const compareResult2 = service.compareReportTitle(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareReportTitle(entity1, entity2);
        const compareResult2 = service.compareReportTitle(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareReportTitle(entity1, entity2);
        const compareResult2 = service.compareReportTitle(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
