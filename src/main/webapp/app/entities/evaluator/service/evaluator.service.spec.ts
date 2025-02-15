import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEvaluator } from '../evaluator.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../evaluator.test-samples';

import { EvaluatorService, RestEvaluator } from './evaluator.service';

const requireRestSample: RestEvaluator = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('Evaluator Service', () => {
  let service: EvaluatorService;
  let httpMock: HttpTestingController;
  let expectedResult: IEvaluator | IEvaluator[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EvaluatorService);
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

    it('should create a Evaluator', () => {
      const evaluator = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(evaluator).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Evaluator', () => {
      const evaluator = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(evaluator).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Evaluator', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Evaluator', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Evaluator', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEvaluatorToCollectionIfMissing', () => {
      it('should add a Evaluator to an empty array', () => {
        const evaluator: IEvaluator = sampleWithRequiredData;
        expectedResult = service.addEvaluatorToCollectionIfMissing([], evaluator);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(evaluator);
      });

      it('should not add a Evaluator to an array that contains it', () => {
        const evaluator: IEvaluator = sampleWithRequiredData;
        const evaluatorCollection: IEvaluator[] = [
          {
            ...evaluator,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEvaluatorToCollectionIfMissing(evaluatorCollection, evaluator);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Evaluator to an array that doesn't contain it", () => {
        const evaluator: IEvaluator = sampleWithRequiredData;
        const evaluatorCollection: IEvaluator[] = [sampleWithPartialData];
        expectedResult = service.addEvaluatorToCollectionIfMissing(evaluatorCollection, evaluator);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(evaluator);
      });

      it('should add only unique Evaluator to an array', () => {
        const evaluatorArray: IEvaluator[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const evaluatorCollection: IEvaluator[] = [sampleWithRequiredData];
        expectedResult = service.addEvaluatorToCollectionIfMissing(evaluatorCollection, ...evaluatorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const evaluator: IEvaluator = sampleWithRequiredData;
        const evaluator2: IEvaluator = sampleWithPartialData;
        expectedResult = service.addEvaluatorToCollectionIfMissing([], evaluator, evaluator2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(evaluator);
        expect(expectedResult).toContain(evaluator2);
      });

      it('should accept null and undefined values', () => {
        const evaluator: IEvaluator = sampleWithRequiredData;
        expectedResult = service.addEvaluatorToCollectionIfMissing([], null, evaluator, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(evaluator);
      });

      it('should return initial array if no Evaluator is added', () => {
        const evaluatorCollection: IEvaluator[] = [sampleWithRequiredData];
        expectedResult = service.addEvaluatorToCollectionIfMissing(evaluatorCollection, undefined, null);
        expect(expectedResult).toEqual(evaluatorCollection);
      });
    });

    describe('compareEvaluator', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEvaluator(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEvaluator(entity1, entity2);
        const compareResult2 = service.compareEvaluator(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEvaluator(entity1, entity2);
        const compareResult2 = service.compareEvaluator(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEvaluator(entity1, entity2);
        const compareResult2 = service.compareEvaluator(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
