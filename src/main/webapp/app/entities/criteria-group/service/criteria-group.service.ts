import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICriteriaGroup, NewCriteriaGroup } from '../criteria-group.model';

export type PartialUpdateCriteriaGroup = Partial<ICriteriaGroup> & Pick<ICriteriaGroup, 'id'>;

type RestOf<T extends ICriteriaGroup | NewCriteriaGroup> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestCriteriaGroup = RestOf<ICriteriaGroup>;

export type NewRestCriteriaGroup = RestOf<NewCriteriaGroup>;

export type PartialUpdateRestCriteriaGroup = RestOf<PartialUpdateCriteriaGroup>;

export type EntityResponseType = HttpResponse<ICriteriaGroup>;
export type EntityArrayResponseType = HttpResponse<ICriteriaGroup[]>;

@Injectable({ providedIn: 'root' })
export class CriteriaGroupService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/criteria-groups');

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get<ICriteriaGroup[]>(this.resourceUrl).pipe(map(converts => converts.some(convert => convert.name === name)));
  }

  create(criteriaGroup: NewCriteriaGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(criteriaGroup);
    return this.http
      .post<RestCriteriaGroup>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(criteriaGroup: ICriteriaGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(criteriaGroup);
    return this.http
      .put<RestCriteriaGroup>(`${this.resourceUrl}/${this.getCriteriaGroupIdentifier(criteriaGroup)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(criteriaGroup: PartialUpdateCriteriaGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(criteriaGroup);
    return this.http
      .patch<RestCriteriaGroup>(`${this.resourceUrl}/${this.getCriteriaGroupIdentifier(criteriaGroup)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCriteriaGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCriteriaGroup[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCriteriaGroupIdentifier(criteriaGroup: Pick<ICriteriaGroup, 'id'>): number {
    return criteriaGroup.id;
  }

  compareCriteriaGroup(o1: Pick<ICriteriaGroup, 'id'> | null, o2: Pick<ICriteriaGroup, 'id'> | null): boolean {
    return o1 && o2 ? this.getCriteriaGroupIdentifier(o1) === this.getCriteriaGroupIdentifier(o2) : o1 === o2;
  }

  addCriteriaGroupToCollectionIfMissing<Type extends Pick<ICriteriaGroup, 'id'>>(
    criteriaGroupCollection: Type[],
    ...criteriaGroupsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const criteriaGroups: Type[] = criteriaGroupsToCheck.filter(isPresent);
    if (criteriaGroups.length > 0) {
      const criteriaGroupCollectionIdentifiers = criteriaGroupCollection.map(criteriaGroupItem =>
        this.getCriteriaGroupIdentifier(criteriaGroupItem),
      );
      const criteriaGroupsToAdd = criteriaGroups.filter(criteriaGroupItem => {
        const criteriaGroupIdentifier = this.getCriteriaGroupIdentifier(criteriaGroupItem);
        if (criteriaGroupCollectionIdentifiers.includes(criteriaGroupIdentifier)) {
          return false;
        }
        criteriaGroupCollectionIdentifiers.push(criteriaGroupIdentifier);
        return true;
      });
      return [...criteriaGroupsToAdd, ...criteriaGroupCollection];
    }
    return criteriaGroupCollection;
  }

  protected convertDateFromClient<T extends ICriteriaGroup | NewCriteriaGroup | PartialUpdateCriteriaGroup>(criteriaGroup: T): RestOf<T> {
    return {
      ...criteriaGroup,
      createdAt: criteriaGroup.createdAt?.toJSON() ?? null,
      updatedAt: criteriaGroup.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCriteriaGroup: RestCriteriaGroup): ICriteriaGroup {
    return {
      ...restCriteriaGroup,
      createdAt: restCriteriaGroup.createdAt ? dayjs(restCriteriaGroup.createdAt) : undefined,
      updatedAt: restCriteriaGroup.updatedAt ? dayjs(restCriteriaGroup.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCriteriaGroup>): HttpResponse<ICriteriaGroup> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCriteriaGroup[]>): HttpResponse<ICriteriaGroup[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
