import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICriteria, NewCriteria } from '../criteria.model';

export type PartialUpdateCriteria = Partial<ICriteria> & Pick<ICriteria, 'id'>;

type RestOf<T extends ICriteria | NewCriteria> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestCriteria = RestOf<ICriteria>;

export type NewRestCriteria = RestOf<NewCriteria>;

export type PartialUpdateRestCriteria = RestOf<PartialUpdateCriteria>;

export type EntityResponseType = HttpResponse<ICriteria>;
export type EntityArrayResponseType = HttpResponse<ICriteria[]>;

@Injectable({ providedIn: 'root' })
export class CriteriaService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/criteria');

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get<ICriteria[]>(this.resourceUrl).pipe(map(converts => converts.some(convert => convert.name === name)));
  }

  getAllCriteriaGroups(): Observable<ICriteria[]> {
    return this.http.get<ICriteria[]>(this.resourceUrl);
  }

  create(criteria: NewCriteria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(criteria);
    return this.http
      .post<RestCriteria>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(criteria: ICriteria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(criteria);
    return this.http
      .put<RestCriteria>(`${this.resourceUrl}/${this.getCriteriaIdentifier(criteria)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(criteria: PartialUpdateCriteria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(criteria);
    return this.http
      .patch<RestCriteria>(`${this.resourceUrl}/${this.getCriteriaIdentifier(criteria)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCriteria>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCriteria[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCriteriaIdentifier(criteria: Pick<ICriteria, 'id'>): number {
    return criteria.id;
  }

  compareCriteria(o1: Pick<ICriteria, 'id'> | null, o2: Pick<ICriteria, 'id'> | null): boolean {
    return o1 && o2 ? this.getCriteriaIdentifier(o1) === this.getCriteriaIdentifier(o2) : o1 === o2;
  }

  addCriteriaToCollectionIfMissing<Type extends Pick<ICriteria, 'id'>>(
    criteriaCollection: Type[],
    ...criteriaToCheck: (Type | null | undefined)[]
  ): Type[] {
    const criteria: Type[] = criteriaToCheck.filter(isPresent);
    if (criteria.length > 0) {
      const criteriaCollectionIdentifiers = criteriaCollection.map(criteriaItem => this.getCriteriaIdentifier(criteriaItem));
      const criteriaToAdd = criteria.filter(criteriaItem => {
        const criteriaIdentifier = this.getCriteriaIdentifier(criteriaItem);
        if (criteriaCollectionIdentifiers.includes(criteriaIdentifier)) {
          return false;
        }
        criteriaCollectionIdentifiers.push(criteriaIdentifier);
        return true;
      });
      return [...criteriaToAdd, ...criteriaCollection];
    }
    return criteriaCollection;
  }

  protected convertDateFromClient<T extends ICriteria | NewCriteria | PartialUpdateCriteria>(criteria: T): RestOf<T> {
    return {
      ...criteria,
      createdAt: criteria.createdAt?.toJSON() ?? null,
      updatedAt: criteria.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCriteria: RestCriteria): ICriteria {
    return {
      ...restCriteria,
      createdAt: restCriteria.createdAt ? dayjs(restCriteria.createdAt) : undefined,
      updatedAt: restCriteria.updatedAt ? dayjs(restCriteria.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCriteria>): HttpResponse<ICriteria> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCriteria[]>): HttpResponse<ICriteria[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
