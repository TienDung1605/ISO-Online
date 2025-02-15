import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICheckTarget } from '../check-target.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../check-target.test-samples';

import { CheckTargetService, RestCheckTarget } from './check-target.service';

const requireRestSample: RestCheckTarget = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('CheckTarget Service', () => {
  let service: CheckTargetService;
  let httpMock: HttpTestingController;
  let expectedResult: ICheckTarget | ICheckTarget[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CheckTargetService);
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

    it('should create a CheckTarget', () => {
      const checkTarget = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(checkTarget).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CheckTarget', () => {
      const checkTarget = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(checkTarget).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CheckTarget', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CheckTarget', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CheckTarget', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCheckTargetToCollectionIfMissing', () => {
      it('should add a CheckTarget to an empty array', () => {
        const checkTarget: ICheckTarget = sampleWithRequiredData;
        expectedResult = service.addCheckTargetToCollectionIfMissing([], checkTarget);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(checkTarget);
      });

      it('should not add a CheckTarget to an array that contains it', () => {
        const checkTarget: ICheckTarget = sampleWithRequiredData;
        const checkTargetCollection: ICheckTarget[] = [
          {
            ...checkTarget,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCheckTargetToCollectionIfMissing(checkTargetCollection, checkTarget);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CheckTarget to an array that doesn't contain it", () => {
        const checkTarget: ICheckTarget = sampleWithRequiredData;
        const checkTargetCollection: ICheckTarget[] = [sampleWithPartialData];
        expectedResult = service.addCheckTargetToCollectionIfMissing(checkTargetCollection, checkTarget);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(checkTarget);
      });

      it('should add only unique CheckTarget to an array', () => {
        const checkTargetArray: ICheckTarget[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const checkTargetCollection: ICheckTarget[] = [sampleWithRequiredData];
        expectedResult = service.addCheckTargetToCollectionIfMissing(checkTargetCollection, ...checkTargetArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const checkTarget: ICheckTarget = sampleWithRequiredData;
        const checkTarget2: ICheckTarget = sampleWithPartialData;
        expectedResult = service.addCheckTargetToCollectionIfMissing([], checkTarget, checkTarget2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(checkTarget);
        expect(expectedResult).toContain(checkTarget2);
      });

      it('should accept null and undefined values', () => {
        const checkTarget: ICheckTarget = sampleWithRequiredData;
        expectedResult = service.addCheckTargetToCollectionIfMissing([], null, checkTarget, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(checkTarget);
      });

      it('should return initial array if no CheckTarget is added', () => {
        const checkTargetCollection: ICheckTarget[] = [sampleWithRequiredData];
        expectedResult = service.addCheckTargetToCollectionIfMissing(checkTargetCollection, undefined, null);
        expect(expectedResult).toEqual(checkTargetCollection);
      });
    });

    describe('compareCheckTarget', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCheckTarget(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCheckTarget(entity1, entity2);
        const compareResult2 = service.compareCheckTarget(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCheckTarget(entity1, entity2);
        const compareResult2 = service.compareCheckTarget(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCheckTarget(entity1, entity2);
        const compareResult2 = service.compareCheckTarget(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
