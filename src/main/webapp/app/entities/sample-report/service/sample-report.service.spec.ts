import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISampleReport } from '../sample-report.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sample-report.test-samples';

import { SampleReportService, RestSampleReport } from './sample-report.service';

const requireRestSample: RestSampleReport = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('SampleReport Service', () => {
  let service: SampleReportService;
  let httpMock: HttpTestingController;
  let expectedResult: ISampleReport | ISampleReport[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SampleReportService);
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

    it('should create a SampleReport', () => {
      const sampleReport = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(sampleReport).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SampleReport', () => {
      const sampleReport = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(sampleReport).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SampleReport', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SampleReport', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SampleReport', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSampleReportToCollectionIfMissing', () => {
      it('should add a SampleReport to an empty array', () => {
        const sampleReport: ISampleReport = sampleWithRequiredData;
        expectedResult = service.addSampleReportToCollectionIfMissing([], sampleReport);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sampleReport);
      });

      it('should not add a SampleReport to an array that contains it', () => {
        const sampleReport: ISampleReport = sampleWithRequiredData;
        const sampleReportCollection: ISampleReport[] = [
          {
            ...sampleReport,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSampleReportToCollectionIfMissing(sampleReportCollection, sampleReport);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SampleReport to an array that doesn't contain it", () => {
        const sampleReport: ISampleReport = sampleWithRequiredData;
        const sampleReportCollection: ISampleReport[] = [sampleWithPartialData];
        expectedResult = service.addSampleReportToCollectionIfMissing(sampleReportCollection, sampleReport);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sampleReport);
      });

      it('should add only unique SampleReport to an array', () => {
        const sampleReportArray: ISampleReport[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sampleReportCollection: ISampleReport[] = [sampleWithRequiredData];
        expectedResult = service.addSampleReportToCollectionIfMissing(sampleReportCollection, ...sampleReportArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sampleReport: ISampleReport = sampleWithRequiredData;
        const sampleReport2: ISampleReport = sampleWithPartialData;
        expectedResult = service.addSampleReportToCollectionIfMissing([], sampleReport, sampleReport2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sampleReport);
        expect(expectedResult).toContain(sampleReport2);
      });

      it('should accept null and undefined values', () => {
        const sampleReport: ISampleReport = sampleWithRequiredData;
        expectedResult = service.addSampleReportToCollectionIfMissing([], null, sampleReport, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sampleReport);
      });

      it('should return initial array if no SampleReport is added', () => {
        const sampleReportCollection: ISampleReport[] = [sampleWithRequiredData];
        expectedResult = service.addSampleReportToCollectionIfMissing(sampleReportCollection, undefined, null);
        expect(expectedResult).toEqual(sampleReportCollection);
      });
    });

    describe('compareSampleReport', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSampleReport(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSampleReport(entity1, entity2);
        const compareResult2 = service.compareSampleReport(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSampleReport(entity1, entity2);
        const compareResult2 = service.compareSampleReport(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSampleReport(entity1, entity2);
        const compareResult2 = service.compareSampleReport(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
