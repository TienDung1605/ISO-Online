import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICriteriaGroup } from '../criteria-group.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../criteria-group.test-samples';

import { CriteriaGroupService, RestCriteriaGroup } from './criteria-group.service';

const requireRestSample: RestCriteriaGroup = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('CriteriaGroup Service', () => {
  let service: CriteriaGroupService;
  let httpMock: HttpTestingController;
  let expectedResult: ICriteriaGroup | ICriteriaGroup[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CriteriaGroupService);
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

    it('should create a CriteriaGroup', () => {
      const criteriaGroup = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(criteriaGroup).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CriteriaGroup', () => {
      const criteriaGroup = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(criteriaGroup).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CriteriaGroup', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CriteriaGroup', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CriteriaGroup', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCriteriaGroupToCollectionIfMissing', () => {
      it('should add a CriteriaGroup to an empty array', () => {
        const criteriaGroup: ICriteriaGroup = sampleWithRequiredData;
        expectedResult = service.addCriteriaGroupToCollectionIfMissing([], criteriaGroup);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(criteriaGroup);
      });

      it('should not add a CriteriaGroup to an array that contains it', () => {
        const criteriaGroup: ICriteriaGroup = sampleWithRequiredData;
        const criteriaGroupCollection: ICriteriaGroup[] = [
          {
            ...criteriaGroup,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCriteriaGroupToCollectionIfMissing(criteriaGroupCollection, criteriaGroup);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CriteriaGroup to an array that doesn't contain it", () => {
        const criteriaGroup: ICriteriaGroup = sampleWithRequiredData;
        const criteriaGroupCollection: ICriteriaGroup[] = [sampleWithPartialData];
        expectedResult = service.addCriteriaGroupToCollectionIfMissing(criteriaGroupCollection, criteriaGroup);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(criteriaGroup);
      });

      it('should add only unique CriteriaGroup to an array', () => {
        const criteriaGroupArray: ICriteriaGroup[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const criteriaGroupCollection: ICriteriaGroup[] = [sampleWithRequiredData];
        expectedResult = service.addCriteriaGroupToCollectionIfMissing(criteriaGroupCollection, ...criteriaGroupArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const criteriaGroup: ICriteriaGroup = sampleWithRequiredData;
        const criteriaGroup2: ICriteriaGroup = sampleWithPartialData;
        expectedResult = service.addCriteriaGroupToCollectionIfMissing([], criteriaGroup, criteriaGroup2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(criteriaGroup);
        expect(expectedResult).toContain(criteriaGroup2);
      });

      it('should accept null and undefined values', () => {
        const criteriaGroup: ICriteriaGroup = sampleWithRequiredData;
        expectedResult = service.addCriteriaGroupToCollectionIfMissing([], null, criteriaGroup, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(criteriaGroup);
      });

      it('should return initial array if no CriteriaGroup is added', () => {
        const criteriaGroupCollection: ICriteriaGroup[] = [sampleWithRequiredData];
        expectedResult = service.addCriteriaGroupToCollectionIfMissing(criteriaGroupCollection, undefined, null);
        expect(expectedResult).toEqual(criteriaGroupCollection);
      });
    });

    describe('compareCriteriaGroup', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCriteriaGroup(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCriteriaGroup(entity1, entity2);
        const compareResult2 = service.compareCriteriaGroup(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCriteriaGroup(entity1, entity2);
        const compareResult2 = service.compareCriteriaGroup(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCriteriaGroup(entity1, entity2);
        const compareResult2 = service.compareCriteriaGroup(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
