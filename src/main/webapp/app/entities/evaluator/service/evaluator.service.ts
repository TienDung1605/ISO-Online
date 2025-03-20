import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEvaluator, NewEvaluator } from '../evaluator.model';

export type PartialUpdateEvaluator = Partial<IEvaluator> & Pick<IEvaluator, 'id'>;

type RestOf<T extends IEvaluator | NewEvaluator> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestEvaluator = RestOf<IEvaluator>;

export type NewRestEvaluator = RestOf<NewEvaluator>;

export type PartialUpdateRestEvaluator = RestOf<PartialUpdateEvaluator>;

export type EntityResponseType = HttpResponse<IEvaluator>;
export type EntityArrayResponseType = HttpResponse<IEvaluator[]>;

@Injectable({ providedIn: 'root' })
export class EvaluatorService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/evaluators');

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get<IEvaluator[]>(this.resourceUrl).pipe(map(converts => converts.some(convert => convert.name === name)));
  }

  create(evaluator: NewEvaluator): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(evaluator);
    return this.http
      .post<RestEvaluator>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(evaluator: IEvaluator): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(evaluator);
    return this.http
      .put<RestEvaluator>(`${this.resourceUrl}/${this.getEvaluatorIdentifier(evaluator)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(evaluator: PartialUpdateEvaluator): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(evaluator);
    return this.http
      .patch<RestEvaluator>(`${this.resourceUrl}/${this.getEvaluatorIdentifier(evaluator)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEvaluator>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEvaluator[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEvaluatorIdentifier(evaluator: Pick<IEvaluator, 'id'>): number {
    return evaluator.id;
  }

  compareEvaluator(o1: Pick<IEvaluator, 'id'> | null, o2: Pick<IEvaluator, 'id'> | null): boolean {
    return o1 && o2 ? this.getEvaluatorIdentifier(o1) === this.getEvaluatorIdentifier(o2) : o1 === o2;
  }

  addEvaluatorToCollectionIfMissing<Type extends Pick<IEvaluator, 'id'>>(
    evaluatorCollection: Type[],
    ...evaluatorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const evaluators: Type[] = evaluatorsToCheck.filter(isPresent);
    if (evaluators.length > 0) {
      const evaluatorCollectionIdentifiers = evaluatorCollection.map(evaluatorItem => this.getEvaluatorIdentifier(evaluatorItem));
      const evaluatorsToAdd = evaluators.filter(evaluatorItem => {
        const evaluatorIdentifier = this.getEvaluatorIdentifier(evaluatorItem);
        if (evaluatorCollectionIdentifiers.includes(evaluatorIdentifier)) {
          return false;
        }
        evaluatorCollectionIdentifiers.push(evaluatorIdentifier);
        return true;
      });
      return [...evaluatorsToAdd, ...evaluatorCollection];
    }
    return evaluatorCollection;
  }

  protected convertDateFromClient<T extends IEvaluator | NewEvaluator | PartialUpdateEvaluator>(evaluator: T): RestOf<T> {
    return {
      ...evaluator,
      createdAt: evaluator.createdAt?.toJSON() ?? null,
      updatedAt: evaluator.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEvaluator: RestEvaluator): IEvaluator {
    return {
      ...restEvaluator,
      createdAt: restEvaluator.createdAt ? dayjs(restEvaluator.createdAt) : undefined,
      updatedAt: restEvaluator.updatedAt ? dayjs(restEvaluator.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEvaluator>): HttpResponse<IEvaluator> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEvaluator[]>): HttpResponse<IEvaluator[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
