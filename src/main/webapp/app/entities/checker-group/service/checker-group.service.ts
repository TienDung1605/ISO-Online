import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICheckerGroup, NewCheckerGroup } from '../checker-group.model';

export type PartialUpdateCheckerGroup = Partial<ICheckerGroup> & Pick<ICheckerGroup, 'id'>;

type RestOf<T extends ICheckerGroup | NewCheckerGroup> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestCheckerGroup = RestOf<ICheckerGroup>;

export type NewRestCheckerGroup = RestOf<NewCheckerGroup>;

export type PartialUpdateRestCheckerGroup = RestOf<PartialUpdateCheckerGroup>;

export type EntityResponseType = HttpResponse<ICheckerGroup>;
export type EntityArrayResponseType = HttpResponse<ICheckerGroup[]>;

@Injectable({ providedIn: 'root' })
export class CheckerGroupService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/checker-groups');

  create(checkerGroup: NewCheckerGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkerGroup);
    return this.http
      .post<RestCheckerGroup>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(checkerGroup: ICheckerGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkerGroup);
    return this.http
      .put<RestCheckerGroup>(`${this.resourceUrl}/${this.getCheckerGroupIdentifier(checkerGroup)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(checkerGroup: PartialUpdateCheckerGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkerGroup);
    return this.http
      .patch<RestCheckerGroup>(`${this.resourceUrl}/${this.getCheckerGroupIdentifier(checkerGroup)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCheckerGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCheckerGroup[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCheckerGroupIdentifier(checkerGroup: Pick<ICheckerGroup, 'id'>): number {
    return checkerGroup.id;
  }

  compareCheckerGroup(o1: Pick<ICheckerGroup, 'id'> | null, o2: Pick<ICheckerGroup, 'id'> | null): boolean {
    return o1 && o2 ? this.getCheckerGroupIdentifier(o1) === this.getCheckerGroupIdentifier(o2) : o1 === o2;
  }

  addCheckerGroupToCollectionIfMissing<Type extends Pick<ICheckerGroup, 'id'>>(
    checkerGroupCollection: Type[],
    ...checkerGroupsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const checkerGroups: Type[] = checkerGroupsToCheck.filter(isPresent);
    if (checkerGroups.length > 0) {
      const checkerGroupCollectionIdentifiers = checkerGroupCollection.map(checkerGroupItem =>
        this.getCheckerGroupIdentifier(checkerGroupItem),
      );
      const checkerGroupsToAdd = checkerGroups.filter(checkerGroupItem => {
        const checkerGroupIdentifier = this.getCheckerGroupIdentifier(checkerGroupItem);
        if (checkerGroupCollectionIdentifiers.includes(checkerGroupIdentifier)) {
          return false;
        }
        checkerGroupCollectionIdentifiers.push(checkerGroupIdentifier);
        return true;
      });
      return [...checkerGroupsToAdd, ...checkerGroupCollection];
    }
    return checkerGroupCollection;
  }

  protected convertDateFromClient<T extends ICheckerGroup | NewCheckerGroup | PartialUpdateCheckerGroup>(checkerGroup: T): RestOf<T> {
    return {
      ...checkerGroup,
      createdAt: checkerGroup.createdAt?.toJSON() ?? null,
      updatedAt: checkerGroup.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCheckerGroup: RestCheckerGroup): ICheckerGroup {
    return {
      ...restCheckerGroup,
      createdAt: restCheckerGroup.createdAt ? dayjs(restCheckerGroup.createdAt) : undefined,
      updatedAt: restCheckerGroup.updatedAt ? dayjs(restCheckerGroup.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCheckerGroup>): HttpResponse<ICheckerGroup> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCheckerGroup[]>): HttpResponse<ICheckerGroup[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
