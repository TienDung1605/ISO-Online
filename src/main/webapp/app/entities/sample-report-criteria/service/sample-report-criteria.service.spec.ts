import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISampleReportCriteria } from '../sample-report-criteria.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../sample-report-criteria.test-samples';

import { SampleReportCriteriaService, RestSampleReportCriteria } from './sample-report-criteria.service';

const requireRestSample: RestSampleReportCriteria = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('SampleReportCriteria Service', () => {
  let service: SampleReportCriteriaService;
  let httpMock: HttpTestingController;
  let expectedResult: ISampleReportCriteria | ISampleReportCriteria[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SampleReportCriteriaService);
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

    it('should create a SampleReportCriteria', () => {
      const sampleReportCriteria = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(sampleReportCriteria).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SampleReportCriteria', () => {
      const sampleReportCriteria = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(sampleReportCriteria).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SampleReportCriteria', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SampleReportCriteria', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SampleReportCriteria', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSampleReportCriteriaToCollectionIfMissing', () => {
      it('should add a SampleReportCriteria to an empty array', () => {
        const sampleReportCriteria: ISampleReportCriteria = sampleWithRequiredData;
        expectedResult = service.addSampleReportCriteriaToCollectionIfMissing([], sampleReportCriteria);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sampleReportCriteria);
      });

      it('should not add a SampleReportCriteria to an array that contains it', () => {
        const sampleReportCriteria: ISampleReportCriteria = sampleWithRequiredData;
        const sampleReportCriteriaCollection: ISampleReportCriteria[] = [
          {
            ...sampleReportCriteria,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSampleReportCriteriaToCollectionIfMissing(sampleReportCriteriaCollection, sampleReportCriteria);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SampleReportCriteria to an array that doesn't contain it", () => {
        const sampleReportCriteria: ISampleReportCriteria = sampleWithRequiredData;
        const sampleReportCriteriaCollection: ISampleReportCriteria[] = [sampleWithPartialData];
        expectedResult = service.addSampleReportCriteriaToCollectionIfMissing(sampleReportCriteriaCollection, sampleReportCriteria);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sampleReportCriteria);
      });

      it('should add only unique SampleReportCriteria to an array', () => {
        const sampleReportCriteriaArray: ISampleReportCriteria[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sampleReportCriteriaCollection: ISampleReportCriteria[] = [sampleWithRequiredData];
        expectedResult = service.addSampleReportCriteriaToCollectionIfMissing(sampleReportCriteriaCollection, ...sampleReportCriteriaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sampleReportCriteria: ISampleReportCriteria = sampleWithRequiredData;
        const sampleReportCriteria2: ISampleReportCriteria = sampleWithPartialData;
        expectedResult = service.addSampleReportCriteriaToCollectionIfMissing([], sampleReportCriteria, sampleReportCriteria2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sampleReportCriteria);
        expect(expectedResult).toContain(sampleReportCriteria2);
      });

      it('should accept null and undefined values', () => {
        const sampleReportCriteria: ISampleReportCriteria = sampleWithRequiredData;
        expectedResult = service.addSampleReportCriteriaToCollectionIfMissing([], null, sampleReportCriteria, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sampleReportCriteria);
      });

      it('should return initial array if no SampleReportCriteria is added', () => {
        const sampleReportCriteriaCollection: ISampleReportCriteria[] = [sampleWithRequiredData];
        expectedResult = service.addSampleReportCriteriaToCollectionIfMissing(sampleReportCriteriaCollection, undefined, null);
        expect(expectedResult).toEqual(sampleReportCriteriaCollection);
      });
    });

    describe('compareSampleReportCriteria', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSampleReportCriteria(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSampleReportCriteria(entity1, entity2);
        const compareResult2 = service.compareSampleReportCriteria(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSampleReportCriteria(entity1, entity2);
        const compareResult2 = service.compareSampleReportCriteria(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSampleReportCriteria(entity1, entity2);
        const compareResult2 = service.compareSampleReportCriteria(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
