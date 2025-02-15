import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICheckerGroup } from '../checker-group.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../checker-group.test-samples';

import { CheckerGroupService, RestCheckerGroup } from './checker-group.service';

const requireRestSample: RestCheckerGroup = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('CheckerGroup Service', () => {
  let service: CheckerGroupService;
  let httpMock: HttpTestingController;
  let expectedResult: ICheckerGroup | ICheckerGroup[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CheckerGroupService);
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

    it('should create a CheckerGroup', () => {
      const checkerGroup = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(checkerGroup).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CheckerGroup', () => {
      const checkerGroup = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(checkerGroup).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CheckerGroup', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CheckerGroup', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CheckerGroup', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCheckerGroupToCollectionIfMissing', () => {
      it('should add a CheckerGroup to an empty array', () => {
        const checkerGroup: ICheckerGroup = sampleWithRequiredData;
        expectedResult = service.addCheckerGroupToCollectionIfMissing([], checkerGroup);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(checkerGroup);
      });

      it('should not add a CheckerGroup to an array that contains it', () => {
        const checkerGroup: ICheckerGroup = sampleWithRequiredData;
        const checkerGroupCollection: ICheckerGroup[] = [
          {
            ...checkerGroup,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCheckerGroupToCollectionIfMissing(checkerGroupCollection, checkerGroup);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CheckerGroup to an array that doesn't contain it", () => {
        const checkerGroup: ICheckerGroup = sampleWithRequiredData;
        const checkerGroupCollection: ICheckerGroup[] = [sampleWithPartialData];
        expectedResult = service.addCheckerGroupToCollectionIfMissing(checkerGroupCollection, checkerGroup);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(checkerGroup);
      });

      it('should add only unique CheckerGroup to an array', () => {
        const checkerGroupArray: ICheckerGroup[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const checkerGroupCollection: ICheckerGroup[] = [sampleWithRequiredData];
        expectedResult = service.addCheckerGroupToCollectionIfMissing(checkerGroupCollection, ...checkerGroupArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const checkerGroup: ICheckerGroup = sampleWithRequiredData;
        const checkerGroup2: ICheckerGroup = sampleWithPartialData;
        expectedResult = service.addCheckerGroupToCollectionIfMissing([], checkerGroup, checkerGroup2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(checkerGroup);
        expect(expectedResult).toContain(checkerGroup2);
      });

      it('should accept null and undefined values', () => {
        const checkerGroup: ICheckerGroup = sampleWithRequiredData;
        expectedResult = service.addCheckerGroupToCollectionIfMissing([], null, checkerGroup, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(checkerGroup);
      });

      it('should return initial array if no CheckerGroup is added', () => {
        const checkerGroupCollection: ICheckerGroup[] = [sampleWithRequiredData];
        expectedResult = service.addCheckerGroupToCollectionIfMissing(checkerGroupCollection, undefined, null);
        expect(expectedResult).toEqual(checkerGroupCollection);
      });
    });

    describe('compareCheckerGroup', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCheckerGroup(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCheckerGroup(entity1, entity2);
        const compareResult2 = service.compareCheckerGroup(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCheckerGroup(entity1, entity2);
        const compareResult2 = service.compareCheckerGroup(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCheckerGroup(entity1, entity2);
        const compareResult2 = service.compareCheckerGroup(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
