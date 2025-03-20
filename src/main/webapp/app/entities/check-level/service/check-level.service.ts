import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICheckLevel, NewCheckLevel } from '../check-level.model';

export type PartialUpdateCheckLevel = Partial<ICheckLevel> & Pick<ICheckLevel, 'id'>;

type RestOf<T extends ICheckLevel | NewCheckLevel> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestCheckLevel = RestOf<ICheckLevel>;

export type NewRestCheckLevel = RestOf<NewCheckLevel>;

export type PartialUpdateRestCheckLevel = RestOf<PartialUpdateCheckLevel>;

export type EntityResponseType = HttpResponse<ICheckLevel>;
export type EntityArrayResponseType = HttpResponse<ICheckLevel[]>;

@Injectable({ providedIn: 'root' })
export class CheckLevelService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/check-levels');

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get<ICheckLevel[]>(this.resourceUrl).pipe(map(converts => converts.some(convert => convert.name === name)));
  }

  getAllCheckLevels(): Observable<ICheckLevel[]> {
    return this.http.get<ICheckLevel[]>(this.resourceUrl);
  }

  create(checkLevel: NewCheckLevel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkLevel);
    return this.http
      .post<RestCheckLevel>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(checkLevel: ICheckLevel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkLevel);
    return this.http
      .put<RestCheckLevel>(`${this.resourceUrl}/${this.getCheckLevelIdentifier(checkLevel)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(checkLevel: PartialUpdateCheckLevel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkLevel);
    return this.http
      .patch<RestCheckLevel>(`${this.resourceUrl}/${this.getCheckLevelIdentifier(checkLevel)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCheckLevel>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCheckLevel[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCheckLevelIdentifier(checkLevel: Pick<ICheckLevel, 'id'>): number {
    return checkLevel.id;
  }

  compareCheckLevel(o1: Pick<ICheckLevel, 'id'> | null, o2: Pick<ICheckLevel, 'id'> | null): boolean {
    return o1 && o2 ? this.getCheckLevelIdentifier(o1) === this.getCheckLevelIdentifier(o2) : o1 === o2;
  }

  addCheckLevelToCollectionIfMissing<Type extends Pick<ICheckLevel, 'id'>>(
    checkLevelCollection: Type[],
    ...checkLevelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const checkLevels: Type[] = checkLevelsToCheck.filter(isPresent);
    if (checkLevels.length > 0) {
      const checkLevelCollectionIdentifiers = checkLevelCollection.map(checkLevelItem => this.getCheckLevelIdentifier(checkLevelItem));
      const checkLevelsToAdd = checkLevels.filter(checkLevelItem => {
        const checkLevelIdentifier = this.getCheckLevelIdentifier(checkLevelItem);
        if (checkLevelCollectionIdentifiers.includes(checkLevelIdentifier)) {
          return false;
        }
        checkLevelCollectionIdentifiers.push(checkLevelIdentifier);
        return true;
      });
      return [...checkLevelsToAdd, ...checkLevelCollection];
    }
    return checkLevelCollection;
  }

  protected convertDateFromClient<T extends ICheckLevel | NewCheckLevel | PartialUpdateCheckLevel>(checkLevel: T): RestOf<T> {
    return {
      ...checkLevel,
      createdAt: checkLevel.createdAt?.toJSON() ?? null,
      updatedAt: checkLevel.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCheckLevel: RestCheckLevel): ICheckLevel {
    return {
      ...restCheckLevel,
      createdAt: restCheckLevel.createdAt ? dayjs(restCheckLevel.createdAt) : undefined,
      updatedAt: restCheckLevel.updatedAt ? dayjs(restCheckLevel.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCheckLevel>): HttpResponse<ICheckLevel> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCheckLevel[]>): HttpResponse<ICheckLevel[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
