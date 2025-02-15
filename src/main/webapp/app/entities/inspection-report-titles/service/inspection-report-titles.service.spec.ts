import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInspectionReportTitles } from '../inspection-report-titles.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../inspection-report-titles.test-samples';

import { InspectionReportTitlesService, RestInspectionReportTitles } from './inspection-report-titles.service';

const requireRestSample: RestInspectionReportTitles = {
  ...sampleWithRequiredData,
  timeCreate: sampleWithRequiredData.timeCreate?.toJSON(),
  timeUpdate: sampleWithRequiredData.timeUpdate?.toJSON(),
};

describe('InspectionReportTitles Service', () => {
  let service: InspectionReportTitlesService;
  let httpMock: HttpTestingController;
  let expectedResult: IInspectionReportTitles | IInspectionReportTitles[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InspectionReportTitlesService);
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

    it('should create a InspectionReportTitles', () => {
      const inspectionReportTitles = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(inspectionReportTitles).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a InspectionReportTitles', () => {
      const inspectionReportTitles = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(inspectionReportTitles).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a InspectionReportTitles', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of InspectionReportTitles', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a InspectionReportTitles', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInspectionReportTitlesToCollectionIfMissing', () => {
      it('should add a InspectionReportTitles to an empty array', () => {
        const inspectionReportTitles: IInspectionReportTitles = sampleWithRequiredData;
        expectedResult = service.addInspectionReportTitlesToCollectionIfMissing([], inspectionReportTitles);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(inspectionReportTitles);
      });

      it('should not add a InspectionReportTitles to an array that contains it', () => {
        const inspectionReportTitles: IInspectionReportTitles = sampleWithRequiredData;
        const inspectionReportTitlesCollection: IInspectionReportTitles[] = [
          {
            ...inspectionReportTitles,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInspectionReportTitlesToCollectionIfMissing(inspectionReportTitlesCollection, inspectionReportTitles);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a InspectionReportTitles to an array that doesn't contain it", () => {
        const inspectionReportTitles: IInspectionReportTitles = sampleWithRequiredData;
        const inspectionReportTitlesCollection: IInspectionReportTitles[] = [sampleWithPartialData];
        expectedResult = service.addInspectionReportTitlesToCollectionIfMissing(inspectionReportTitlesCollection, inspectionReportTitles);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(inspectionReportTitles);
      });

      it('should add only unique InspectionReportTitles to an array', () => {
        const inspectionReportTitlesArray: IInspectionReportTitles[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const inspectionReportTitlesCollection: IInspectionReportTitles[] = [sampleWithRequiredData];
        expectedResult = service.addInspectionReportTitlesToCollectionIfMissing(
          inspectionReportTitlesCollection,
          ...inspectionReportTitlesArray,
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const inspectionReportTitles: IInspectionReportTitles = sampleWithRequiredData;
        const inspectionReportTitles2: IInspectionReportTitles = sampleWithPartialData;
        expectedResult = service.addInspectionReportTitlesToCollectionIfMissing([], inspectionReportTitles, inspectionReportTitles2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(inspectionReportTitles);
        expect(expectedResult).toContain(inspectionReportTitles2);
      });

      it('should accept null and undefined values', () => {
        const inspectionReportTitles: IInspectionReportTitles = sampleWithRequiredData;
        expectedResult = service.addInspectionReportTitlesToCollectionIfMissing([], null, inspectionReportTitles, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(inspectionReportTitles);
      });

      it('should return initial array if no InspectionReportTitles is added', () => {
        const inspectionReportTitlesCollection: IInspectionReportTitles[] = [sampleWithRequiredData];
        expectedResult = service.addInspectionReportTitlesToCollectionIfMissing(inspectionReportTitlesCollection, undefined, null);
        expect(expectedResult).toEqual(inspectionReportTitlesCollection);
      });
    });

    describe('compareInspectionReportTitles', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInspectionReportTitles(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInspectionReportTitles(entity1, entity2);
        const compareResult2 = service.compareInspectionReportTitles(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInspectionReportTitles(entity1, entity2);
        const compareResult2 = service.compareInspectionReportTitles(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInspectionReportTitles(entity1, entity2);
        const compareResult2 = service.compareInspectionReportTitles(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
