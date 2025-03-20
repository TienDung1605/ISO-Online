import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParts, NewParts } from '../parts.model';

export type PartialUpdateParts = Partial<IParts> & Pick<IParts, 'id'>;

type RestOf<T extends IParts | NewParts> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestParts = RestOf<IParts>;

export type NewRestParts = RestOf<NewParts>;

export type PartialUpdateRestParts = RestOf<PartialUpdateParts>;

export type EntityResponseType = HttpResponse<IParts>;
export type EntityArrayResponseType = HttpResponse<IParts[]>;

@Injectable({ providedIn: 'root' })
export class PartsService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/parts');

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get<IParts[]>(this.resourceUrl).pipe(map(converts => converts.some(convert => convert.name === name)));
  }

  create(parts: NewParts): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(parts);
    return this.http.post<RestParts>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(parts: IParts): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(parts);
    return this.http
      .put<RestParts>(`${this.resourceUrl}/${this.getPartsIdentifier(parts)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(parts: PartialUpdateParts): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(parts);
    return this.http
      .patch<RestParts>(`${this.resourceUrl}/${this.getPartsIdentifier(parts)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestParts>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestParts[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPartsIdentifier(parts: Pick<IParts, 'id'>): number {
    return parts.id;
  }

  compareParts(o1: Pick<IParts, 'id'> | null, o2: Pick<IParts, 'id'> | null): boolean {
    return o1 && o2 ? this.getPartsIdentifier(o1) === this.getPartsIdentifier(o2) : o1 === o2;
  }

  addPartsToCollectionIfMissing<Type extends Pick<IParts, 'id'>>(
    partsCollection: Type[],
    ...partsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const parts: Type[] = partsToCheck.filter(isPresent);
    if (parts.length > 0) {
      const partsCollectionIdentifiers = partsCollection.map(partsItem => this.getPartsIdentifier(partsItem));
      const partsToAdd = parts.filter(partsItem => {
        const partsIdentifier = this.getPartsIdentifier(partsItem);
        if (partsCollectionIdentifiers.includes(partsIdentifier)) {
          return false;
        }
        partsCollectionIdentifiers.push(partsIdentifier);
        return true;
      });
      return [...partsToAdd, ...partsCollection];
    }
    return partsCollection;
  }

  protected convertDateFromClient<T extends IParts | NewParts | PartialUpdateParts>(parts: T): RestOf<T> {
    return {
      ...parts,
      createdAt: parts.createdAt?.toJSON() ?? null,
      updatedAt: parts.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restParts: RestParts): IParts {
    return {
      ...restParts,
      createdAt: restParts.createdAt ? dayjs(restParts.createdAt) : undefined,
      updatedAt: restParts.updatedAt ? dayjs(restParts.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestParts>): HttpResponse<IParts> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestParts[]>): HttpResponse<IParts[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
