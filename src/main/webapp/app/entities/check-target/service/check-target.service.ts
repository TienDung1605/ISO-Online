import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICheckTarget, NewCheckTarget } from '../check-target.model';

export type PartialUpdateCheckTarget = Partial<ICheckTarget> & Pick<ICheckTarget, 'id'>;

type RestOf<T extends ICheckTarget | NewCheckTarget> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestCheckTarget = RestOf<ICheckTarget>;

export type NewRestCheckTarget = RestOf<NewCheckTarget>;

export type PartialUpdateRestCheckTarget = RestOf<PartialUpdateCheckTarget>;

export type EntityResponseType = HttpResponse<ICheckTarget>;
export type EntityArrayResponseType = HttpResponse<ICheckTarget[]>;

@Injectable({ providedIn: 'root' })
export class CheckTargetService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/check-targets');

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get<ICheckTarget[]>(this.resourceUrl).pipe(map(converts => converts.some(convert => convert.name === name)));
  }

  getAllCheckTargets(): Observable<ICheckTarget[]> {
    return this.http.get<ICheckTarget[]>(this.resourceUrl);
  }

  create(checkTarget: NewCheckTarget): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkTarget);
    return this.http
      .post<RestCheckTarget>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(checkTarget: ICheckTarget): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkTarget);
    return this.http
      .put<RestCheckTarget>(`${this.resourceUrl}/${this.getCheckTargetIdentifier(checkTarget)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(checkTarget: PartialUpdateCheckTarget): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(checkTarget);
    return this.http
      .patch<RestCheckTarget>(`${this.resourceUrl}/${this.getCheckTargetIdentifier(checkTarget)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCheckTarget>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCheckTarget[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCheckTargetIdentifier(checkTarget: Pick<ICheckTarget, 'id'>): number {
    return checkTarget.id;
  }

  compareCheckTarget(o1: Pick<ICheckTarget, 'id'> | null, o2: Pick<ICheckTarget, 'id'> | null): boolean {
    return o1 && o2 ? this.getCheckTargetIdentifier(o1) === this.getCheckTargetIdentifier(o2) : o1 === o2;
  }

  addCheckTargetToCollectionIfMissing<Type extends Pick<ICheckTarget, 'id'>>(
    checkTargetCollection: Type[],
    ...checkTargetsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const checkTargets: Type[] = checkTargetsToCheck.filter(isPresent);
    if (checkTargets.length > 0) {
      const checkTargetCollectionIdentifiers = checkTargetCollection.map(checkTargetItem => this.getCheckTargetIdentifier(checkTargetItem));
      const checkTargetsToAdd = checkTargets.filter(checkTargetItem => {
        const checkTargetIdentifier = this.getCheckTargetIdentifier(checkTargetItem);
        if (checkTargetCollectionIdentifiers.includes(checkTargetIdentifier)) {
          return false;
        }
        checkTargetCollectionIdentifiers.push(checkTargetIdentifier);
        return true;
      });
      return [...checkTargetsToAdd, ...checkTargetCollection];
    }
    return checkTargetCollection;
  }

  protected convertDateFromClient<T extends ICheckTarget | NewCheckTarget | PartialUpdateCheckTarget>(checkTarget: T): RestOf<T> {
    return {
      ...checkTarget,
      createdAt: checkTarget.createdAt?.toJSON() ?? null,
      updatedAt: checkTarget.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCheckTarget: RestCheckTarget): ICheckTarget {
    return {
      ...restCheckTarget,
      createdAt: restCheckTarget.createdAt ? dayjs(restCheckTarget.createdAt) : undefined,
      updatedAt: restCheckTarget.updatedAt ? dayjs(restCheckTarget.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCheckTarget>): HttpResponse<ICheckTarget> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCheckTarget[]>): HttpResponse<ICheckTarget[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
