import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IConvert } from '../convert.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../convert.test-samples';

import { ConvertService, RestConvert } from './convert.service';

const requireRestSample: RestConvert = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('Convert Service', () => {
  let service: ConvertService;
  let httpMock: HttpTestingController;
  let expectedResult: IConvert | IConvert[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ConvertService);
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

    it('should create a Convert', () => {
      const convert = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(convert).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Convert', () => {
      const convert = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(convert).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Convert', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Convert', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Convert', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addConvertToCollectionIfMissing', () => {
      it('should add a Convert to an empty array', () => {
        const convert: IConvert = sampleWithRequiredData;
        expectedResult = service.addConvertToCollectionIfMissing([], convert);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(convert);
      });

      it('should not add a Convert to an array that contains it', () => {
        const convert: IConvert = sampleWithRequiredData;
        const convertCollection: IConvert[] = [
          {
            ...convert,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addConvertToCollectionIfMissing(convertCollection, convert);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Convert to an array that doesn't contain it", () => {
        const convert: IConvert = sampleWithRequiredData;
        const convertCollection: IConvert[] = [sampleWithPartialData];
        expectedResult = service.addConvertToCollectionIfMissing(convertCollection, convert);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(convert);
      });

      it('should add only unique Convert to an array', () => {
        const convertArray: IConvert[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const convertCollection: IConvert[] = [sampleWithRequiredData];
        expectedResult = service.addConvertToCollectionIfMissing(convertCollection, ...convertArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const convert: IConvert = sampleWithRequiredData;
        const convert2: IConvert = sampleWithPartialData;
        expectedResult = service.addConvertToCollectionIfMissing([], convert, convert2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(convert);
        expect(expectedResult).toContain(convert2);
      });

      it('should accept null and undefined values', () => {
        const convert: IConvert = sampleWithRequiredData;
        expectedResult = service.addConvertToCollectionIfMissing([], null, convert, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(convert);
      });

      it('should return initial array if no Convert is added', () => {
        const convertCollection: IConvert[] = [sampleWithRequiredData];
        expectedResult = service.addConvertToCollectionIfMissing(convertCollection, undefined, null);
        expect(expectedResult).toEqual(convertCollection);
      });
    });

    describe('compareConvert', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareConvert(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareConvert(entity1, entity2);
        const compareResult2 = service.compareConvert(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareConvert(entity1, entity2);
        const compareResult2 = service.compareConvert(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareConvert(entity1, entity2);
        const compareResult2 = service.compareConvert(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
