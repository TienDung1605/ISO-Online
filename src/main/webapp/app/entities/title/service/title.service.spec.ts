import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITitle } from '../title.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../title.test-samples';

import { TitleService, RestTitle } from './title.service';

const requireRestSample: RestTitle = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('Title Service', () => {
  let service: TitleService;
  let httpMock: HttpTestingController;
  let expectedResult: ITitle | ITitle[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TitleService);
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

    it('should create a Title', () => {
      const title = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(title).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Title', () => {
      const title = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(title).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Title', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Title', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Title', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTitleToCollectionIfMissing', () => {
      it('should add a Title to an empty array', () => {
        const title: ITitle = sampleWithRequiredData;
        expectedResult = service.addTitleToCollectionIfMissing([], title);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(title);
      });

      it('should not add a Title to an array that contains it', () => {
        const title: ITitle = sampleWithRequiredData;
        const titleCollection: ITitle[] = [
          {
            ...title,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTitleToCollectionIfMissing(titleCollection, title);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Title to an array that doesn't contain it", () => {
        const title: ITitle = sampleWithRequiredData;
        const titleCollection: ITitle[] = [sampleWithPartialData];
        expectedResult = service.addTitleToCollectionIfMissing(titleCollection, title);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(title);
      });

      it('should add only unique Title to an array', () => {
        const titleArray: ITitle[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const titleCollection: ITitle[] = [sampleWithRequiredData];
        expectedResult = service.addTitleToCollectionIfMissing(titleCollection, ...titleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const title: ITitle = sampleWithRequiredData;
        const title2: ITitle = sampleWithPartialData;
        expectedResult = service.addTitleToCollectionIfMissing([], title, title2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(title);
        expect(expectedResult).toContain(title2);
      });

      it('should accept null and undefined values', () => {
        const title: ITitle = sampleWithRequiredData;
        expectedResult = service.addTitleToCollectionIfMissing([], null, title, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(title);
      });

      it('should return initial array if no Title is added', () => {
        const titleCollection: ITitle[] = [sampleWithRequiredData];
        expectedResult = service.addTitleToCollectionIfMissing(titleCollection, undefined, null);
        expect(expectedResult).toEqual(titleCollection);
      });
    });

    describe('compareTitle', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTitle(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTitle(entity1, entity2);
        const compareResult2 = service.compareTitle(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTitle(entity1, entity2);
        const compareResult2 = service.compareTitle(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTitle(entity1, entity2);
        const compareResult2 = service.compareTitle(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
