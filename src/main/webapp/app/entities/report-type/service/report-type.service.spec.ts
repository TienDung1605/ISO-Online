import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReportType } from '../report-type.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../report-type.test-samples';

import { ReportTypeService, RestReportType } from './report-type.service';

const requireRestSample: RestReportType = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('ReportType Service', () => {
  let service: ReportTypeService;
  let httpMock: HttpTestingController;
  let expectedResult: IReportType | IReportType[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReportTypeService);
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

    it('should create a ReportType', () => {
      const reportType = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(reportType).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ReportType', () => {
      const reportType = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(reportType).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ReportType', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ReportType', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ReportType', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addReportTypeToCollectionIfMissing', () => {
      it('should add a ReportType to an empty array', () => {
        const reportType: IReportType = sampleWithRequiredData;
        expectedResult = service.addReportTypeToCollectionIfMissing([], reportType);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reportType);
      });

      it('should not add a ReportType to an array that contains it', () => {
        const reportType: IReportType = sampleWithRequiredData;
        const reportTypeCollection: IReportType[] = [
          {
            ...reportType,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addReportTypeToCollectionIfMissing(reportTypeCollection, reportType);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ReportType to an array that doesn't contain it", () => {
        const reportType: IReportType = sampleWithRequiredData;
        const reportTypeCollection: IReportType[] = [sampleWithPartialData];
        expectedResult = service.addReportTypeToCollectionIfMissing(reportTypeCollection, reportType);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reportType);
      });

      it('should add only unique ReportType to an array', () => {
        const reportTypeArray: IReportType[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const reportTypeCollection: IReportType[] = [sampleWithRequiredData];
        expectedResult = service.addReportTypeToCollectionIfMissing(reportTypeCollection, ...reportTypeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reportType: IReportType = sampleWithRequiredData;
        const reportType2: IReportType = sampleWithPartialData;
        expectedResult = service.addReportTypeToCollectionIfMissing([], reportType, reportType2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reportType);
        expect(expectedResult).toContain(reportType2);
      });

      it('should accept null and undefined values', () => {
        const reportType: IReportType = sampleWithRequiredData;
        expectedResult = service.addReportTypeToCollectionIfMissing([], null, reportType, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reportType);
      });

      it('should return initial array if no ReportType is added', () => {
        const reportTypeCollection: IReportType[] = [sampleWithRequiredData];
        expectedResult = service.addReportTypeToCollectionIfMissing(reportTypeCollection, undefined, null);
        expect(expectedResult).toEqual(reportTypeCollection);
      });
    });

    describe('compareReportType', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareReportType(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareReportType(entity1, entity2);
        const compareResult2 = service.compareReportType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareReportType(entity1, entity2);
        const compareResult2 = service.compareReportType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareReportType(entity1, entity2);
        const compareResult2 = service.compareReportType(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
