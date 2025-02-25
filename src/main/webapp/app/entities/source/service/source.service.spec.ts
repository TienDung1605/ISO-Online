import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISource } from '../source.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../source.test-samples';

import { SourceService, RestSource } from './source.service';

const requireRestSample: RestSource = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('Source Service', () => {
  let service: SourceService;
  let httpMock: HttpTestingController;
  let expectedResult: ISource | ISource[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SourceService);
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

    it('should create a Source', () => {
      const source = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(source).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Source', () => {
      const source = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(source).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Source', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Source', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Source', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSourceToCollectionIfMissing', () => {
      it('should add a Source to an empty array', () => {
        const source: ISource = sampleWithRequiredData;
        expectedResult = service.addSourceToCollectionIfMissing([], source);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(source);
      });

      it('should not add a Source to an array that contains it', () => {
        const source: ISource = sampleWithRequiredData;
        const sourceCollection: ISource[] = [
          {
            ...source,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSourceToCollectionIfMissing(sourceCollection, source);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Source to an array that doesn't contain it", () => {
        const source: ISource = sampleWithRequiredData;
        const sourceCollection: ISource[] = [sampleWithPartialData];
        expectedResult = service.addSourceToCollectionIfMissing(sourceCollection, source);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(source);
      });

      it('should add only unique Source to an array', () => {
        const sourceArray: ISource[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sourceCollection: ISource[] = [sampleWithRequiredData];
        expectedResult = service.addSourceToCollectionIfMissing(sourceCollection, ...sourceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const source: ISource = sampleWithRequiredData;
        const source2: ISource = sampleWithPartialData;
        expectedResult = service.addSourceToCollectionIfMissing([], source, source2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(source);
        expect(expectedResult).toContain(source2);
      });

      it('should accept null and undefined values', () => {
        const source: ISource = sampleWithRequiredData;
        expectedResult = service.addSourceToCollectionIfMissing([], null, source, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(source);
      });

      it('should return initial array if no Source is added', () => {
        const sourceCollection: ISource[] = [sampleWithRequiredData];
        expectedResult = service.addSourceToCollectionIfMissing(sourceCollection, undefined, null);
        expect(expectedResult).toEqual(sourceCollection);
      });
    });

    describe('compareSource', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSource(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSource(entity1, entity2);
        const compareResult2 = service.compareSource(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSource(entity1, entity2);
        const compareResult2 = service.compareSource(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSource(entity1, entity2);
        const compareResult2 = service.compareSource(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
