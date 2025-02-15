import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IParts } from '../parts.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../parts.test-samples';

import { PartsService, RestParts } from './parts.service';

const requireRestSample: RestParts = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('Parts Service', () => {
  let service: PartsService;
  let httpMock: HttpTestingController;
  let expectedResult: IParts | IParts[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PartsService);
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

    it('should create a Parts', () => {
      const parts = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(parts).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Parts', () => {
      const parts = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(parts).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Parts', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Parts', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Parts', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPartsToCollectionIfMissing', () => {
      it('should add a Parts to an empty array', () => {
        const parts: IParts = sampleWithRequiredData;
        expectedResult = service.addPartsToCollectionIfMissing([], parts);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parts);
      });

      it('should not add a Parts to an array that contains it', () => {
        const parts: IParts = sampleWithRequiredData;
        const partsCollection: IParts[] = [
          {
            ...parts,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPartsToCollectionIfMissing(partsCollection, parts);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Parts to an array that doesn't contain it", () => {
        const parts: IParts = sampleWithRequiredData;
        const partsCollection: IParts[] = [sampleWithPartialData];
        expectedResult = service.addPartsToCollectionIfMissing(partsCollection, parts);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parts);
      });

      it('should add only unique Parts to an array', () => {
        const partsArray: IParts[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const partsCollection: IParts[] = [sampleWithRequiredData];
        expectedResult = service.addPartsToCollectionIfMissing(partsCollection, ...partsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const parts: IParts = sampleWithRequiredData;
        const parts2: IParts = sampleWithPartialData;
        expectedResult = service.addPartsToCollectionIfMissing([], parts, parts2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parts);
        expect(expectedResult).toContain(parts2);
      });

      it('should accept null and undefined values', () => {
        const parts: IParts = sampleWithRequiredData;
        expectedResult = service.addPartsToCollectionIfMissing([], null, parts, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parts);
      });

      it('should return initial array if no Parts is added', () => {
        const partsCollection: IParts[] = [sampleWithRequiredData];
        expectedResult = service.addPartsToCollectionIfMissing(partsCollection, undefined, null);
        expect(expectedResult).toEqual(partsCollection);
      });
    });

    describe('compareParts', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareParts(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareParts(entity1, entity2);
        const compareResult2 = service.compareParts(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareParts(entity1, entity2);
        const compareResult2 = service.compareParts(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareParts(entity1, entity2);
        const compareResult2 = service.compareParts(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
