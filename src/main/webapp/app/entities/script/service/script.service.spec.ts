import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IScript } from '../script.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../script.test-samples';

import { ScriptService, RestScript } from './script.service';

const requireRestSample: RestScript = {
  ...sampleWithRequiredData,
  timeStart: sampleWithRequiredData.timeStart?.toJSON(),
  timeEnd: sampleWithRequiredData.timeEnd?.toJSON(),
  timeCheck: sampleWithRequiredData.timeCheck?.toJSON(),
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('Script Service', () => {
  let service: ScriptService;
  let httpMock: HttpTestingController;
  let expectedResult: IScript | IScript[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ScriptService);
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

    it('should create a Script', () => {
      const script = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(script).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Script', () => {
      const script = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(script).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Script', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Script', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Script', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addScriptToCollectionIfMissing', () => {
      it('should add a Script to an empty array', () => {
        const script: IScript = sampleWithRequiredData;
        expectedResult = service.addScriptToCollectionIfMissing([], script);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(script);
      });

      it('should not add a Script to an array that contains it', () => {
        const script: IScript = sampleWithRequiredData;
        const scriptCollection: IScript[] = [
          {
            ...script,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addScriptToCollectionIfMissing(scriptCollection, script);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Script to an array that doesn't contain it", () => {
        const script: IScript = sampleWithRequiredData;
        const scriptCollection: IScript[] = [sampleWithPartialData];
        expectedResult = service.addScriptToCollectionIfMissing(scriptCollection, script);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(script);
      });

      it('should add only unique Script to an array', () => {
        const scriptArray: IScript[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const scriptCollection: IScript[] = [sampleWithRequiredData];
        expectedResult = service.addScriptToCollectionIfMissing(scriptCollection, ...scriptArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const script: IScript = sampleWithRequiredData;
        const script2: IScript = sampleWithPartialData;
        expectedResult = service.addScriptToCollectionIfMissing([], script, script2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(script);
        expect(expectedResult).toContain(script2);
      });

      it('should accept null and undefined values', () => {
        const script: IScript = sampleWithRequiredData;
        expectedResult = service.addScriptToCollectionIfMissing([], null, script, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(script);
      });

      it('should return initial array if no Script is added', () => {
        const scriptCollection: IScript[] = [sampleWithRequiredData];
        expectedResult = service.addScriptToCollectionIfMissing(scriptCollection, undefined, null);
        expect(expectedResult).toEqual(scriptCollection);
      });
    });

    describe('compareScript', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareScript(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareScript(entity1, entity2);
        const compareResult2 = service.compareScript(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareScript(entity1, entity2);
        const compareResult2 = service.compareScript(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareScript(entity1, entity2);
        const compareResult2 = service.compareScript(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
