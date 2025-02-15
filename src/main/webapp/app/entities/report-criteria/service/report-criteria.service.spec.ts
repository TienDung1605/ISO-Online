import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReportCriteria } from '../report-criteria.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../report-criteria.test-samples';

import { ReportCriteriaService, RestReportCriteria } from './report-criteria.service';

const requireRestSample: RestReportCriteria = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('ReportCriteria Service', () => {
  let service: ReportCriteriaService;
  let httpMock: HttpTestingController;
  let expectedResult: IReportCriteria | IReportCriteria[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReportCriteriaService);
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

    it('should create a ReportCriteria', () => {
      const reportCriteria = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(reportCriteria).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ReportCriteria', () => {
      const reportCriteria = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(reportCriteria).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ReportCriteria', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ReportCriteria', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ReportCriteria', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addReportCriteriaToCollectionIfMissing', () => {
      it('should add a ReportCriteria to an empty array', () => {
        const reportCriteria: IReportCriteria = sampleWithRequiredData;
        expectedResult = service.addReportCriteriaToCollectionIfMissing([], reportCriteria);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reportCriteria);
      });

      it('should not add a ReportCriteria to an array that contains it', () => {
        const reportCriteria: IReportCriteria = sampleWithRequiredData;
        const reportCriteriaCollection: IReportCriteria[] = [
          {
            ...reportCriteria,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addReportCriteriaToCollectionIfMissing(reportCriteriaCollection, reportCriteria);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ReportCriteria to an array that doesn't contain it", () => {
        const reportCriteria: IReportCriteria = sampleWithRequiredData;
        const reportCriteriaCollection: IReportCriteria[] = [sampleWithPartialData];
        expectedResult = service.addReportCriteriaToCollectionIfMissing(reportCriteriaCollection, reportCriteria);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reportCriteria);
      });

      it('should add only unique ReportCriteria to an array', () => {
        const reportCriteriaArray: IReportCriteria[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const reportCriteriaCollection: IReportCriteria[] = [sampleWithRequiredData];
        expectedResult = service.addReportCriteriaToCollectionIfMissing(reportCriteriaCollection, ...reportCriteriaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reportCriteria: IReportCriteria = sampleWithRequiredData;
        const reportCriteria2: IReportCriteria = sampleWithPartialData;
        expectedResult = service.addReportCriteriaToCollectionIfMissing([], reportCriteria, reportCriteria2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reportCriteria);
        expect(expectedResult).toContain(reportCriteria2);
      });

      it('should accept null and undefined values', () => {
        const reportCriteria: IReportCriteria = sampleWithRequiredData;
        expectedResult = service.addReportCriteriaToCollectionIfMissing([], null, reportCriteria, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reportCriteria);
      });

      it('should return initial array if no ReportCriteria is added', () => {
        const reportCriteriaCollection: IReportCriteria[] = [sampleWithRequiredData];
        expectedResult = service.addReportCriteriaToCollectionIfMissing(reportCriteriaCollection, undefined, null);
        expect(expectedResult).toEqual(reportCriteriaCollection);
      });
    });

    describe('compareReportCriteria', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareReportCriteria(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareReportCriteria(entity1, entity2);
        const compareResult2 = service.compareReportCriteria(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareReportCriteria(entity1, entity2);
        const compareResult2 = service.compareReportCriteria(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareReportCriteria(entity1, entity2);
        const compareResult2 = service.compareReportCriteria(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
