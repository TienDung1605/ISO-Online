import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICheckLevel } from '../check-level.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../check-level.test-samples';

import { CheckLevelService, RestCheckLevel } from './check-level.service';

const requireRestSample: RestCheckLevel = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('CheckLevel Service', () => {
  let service: CheckLevelService;
  let httpMock: HttpTestingController;
  let expectedResult: ICheckLevel | ICheckLevel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CheckLevelService);
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

    it('should create a CheckLevel', () => {
      const checkLevel = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(checkLevel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CheckLevel', () => {
      const checkLevel = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(checkLevel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CheckLevel', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CheckLevel', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CheckLevel', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCheckLevelToCollectionIfMissing', () => {
      it('should add a CheckLevel to an empty array', () => {
        const checkLevel: ICheckLevel = sampleWithRequiredData;
        expectedResult = service.addCheckLevelToCollectionIfMissing([], checkLevel);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(checkLevel);
      });

      it('should not add a CheckLevel to an array that contains it', () => {
        const checkLevel: ICheckLevel = sampleWithRequiredData;
        const checkLevelCollection: ICheckLevel[] = [
          {
            ...checkLevel,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCheckLevelToCollectionIfMissing(checkLevelCollection, checkLevel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CheckLevel to an array that doesn't contain it", () => {
        const checkLevel: ICheckLevel = sampleWithRequiredData;
        const checkLevelCollection: ICheckLevel[] = [sampleWithPartialData];
        expectedResult = service.addCheckLevelToCollectionIfMissing(checkLevelCollection, checkLevel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(checkLevel);
      });

      it('should add only unique CheckLevel to an array', () => {
        const checkLevelArray: ICheckLevel[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const checkLevelCollection: ICheckLevel[] = [sampleWithRequiredData];
        expectedResult = service.addCheckLevelToCollectionIfMissing(checkLevelCollection, ...checkLevelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const checkLevel: ICheckLevel = sampleWithRequiredData;
        const checkLevel2: ICheckLevel = sampleWithPartialData;
        expectedResult = service.addCheckLevelToCollectionIfMissing([], checkLevel, checkLevel2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(checkLevel);
        expect(expectedResult).toContain(checkLevel2);
      });

      it('should accept null and undefined values', () => {
        const checkLevel: ICheckLevel = sampleWithRequiredData;
        expectedResult = service.addCheckLevelToCollectionIfMissing([], null, checkLevel, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(checkLevel);
      });

      it('should return initial array if no CheckLevel is added', () => {
        const checkLevelCollection: ICheckLevel[] = [sampleWithRequiredData];
        expectedResult = service.addCheckLevelToCollectionIfMissing(checkLevelCollection, undefined, null);
        expect(expectedResult).toEqual(checkLevelCollection);
      });
    });

    describe('compareCheckLevel', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCheckLevel(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCheckLevel(entity1, entity2);
        const compareResult2 = service.compareCheckLevel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCheckLevel(entity1, entity2);
        const compareResult2 = service.compareCheckLevel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCheckLevel(entity1, entity2);
        const compareResult2 = service.compareCheckLevel(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
