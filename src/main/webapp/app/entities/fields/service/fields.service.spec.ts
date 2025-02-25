import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFields } from '../fields.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../fields.test-samples';

import { FieldsService, RestFields } from './fields.service';

const requireRestSample: RestFields = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('Fields Service', () => {
  let service: FieldsService;
  let httpMock: HttpTestingController;
  let expectedResult: IFields | IFields[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FieldsService);
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

    it('should create a Fields', () => {
      const fields = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(fields).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Fields', () => {
      const fields = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(fields).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Fields', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Fields', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Fields', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFieldsToCollectionIfMissing', () => {
      it('should add a Fields to an empty array', () => {
        const fields: IFields = sampleWithRequiredData;
        expectedResult = service.addFieldsToCollectionIfMissing([], fields);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fields);
      });

      it('should not add a Fields to an array that contains it', () => {
        const fields: IFields = sampleWithRequiredData;
        const fieldsCollection: IFields[] = [
          {
            ...fields,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFieldsToCollectionIfMissing(fieldsCollection, fields);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Fields to an array that doesn't contain it", () => {
        const fields: IFields = sampleWithRequiredData;
        const fieldsCollection: IFields[] = [sampleWithPartialData];
        expectedResult = service.addFieldsToCollectionIfMissing(fieldsCollection, fields);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fields);
      });

      it('should add only unique Fields to an array', () => {
        const fieldsArray: IFields[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const fieldsCollection: IFields[] = [sampleWithRequiredData];
        expectedResult = service.addFieldsToCollectionIfMissing(fieldsCollection, ...fieldsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const fields: IFields = sampleWithRequiredData;
        const fields2: IFields = sampleWithPartialData;
        expectedResult = service.addFieldsToCollectionIfMissing([], fields, fields2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fields);
        expect(expectedResult).toContain(fields2);
      });

      it('should accept null and undefined values', () => {
        const fields: IFields = sampleWithRequiredData;
        expectedResult = service.addFieldsToCollectionIfMissing([], null, fields, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fields);
      });

      it('should return initial array if no Fields is added', () => {
        const fieldsCollection: IFields[] = [sampleWithRequiredData];
        expectedResult = service.addFieldsToCollectionIfMissing(fieldsCollection, undefined, null);
        expect(expectedResult).toEqual(fieldsCollection);
      });
    });

    describe('compareFields', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFields(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFields(entity1, entity2);
        const compareResult2 = service.compareFields(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFields(entity1, entity2);
        const compareResult2 = service.compareFields(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFields(entity1, entity2);
        const compareResult2 = service.compareFields(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
