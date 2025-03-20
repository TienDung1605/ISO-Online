import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConvert, NewConvert } from '../convert.model';

export type PartialUpdateConvert = Partial<IConvert> & Pick<IConvert, 'id'>;

type RestOf<T extends IConvert | NewConvert> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestConvert = RestOf<IConvert>;

export type NewRestConvert = RestOf<NewConvert>;

export type PartialUpdateRestConvert = RestOf<PartialUpdateConvert>;

export type EntityResponseType = HttpResponse<IConvert>;
export type EntityArrayResponseType = HttpResponse<IConvert[]>;

@Injectable({ providedIn: 'root' })
export class ConvertService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/converts');

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get<IConvert[]>(this.resourceUrl).pipe(map(converts => converts.some(convert => convert.name === name)));
  }

  create(convert: NewConvert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(convert);
    return this.http
      .post<RestConvert>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(convert: IConvert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(convert);
    return this.http
      .put<RestConvert>(`${this.resourceUrl}/${this.getConvertIdentifier(convert)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(convert: PartialUpdateConvert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(convert);
    return this.http
      .patch<RestConvert>(`${this.resourceUrl}/${this.getConvertIdentifier(convert)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestConvert>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestConvert[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getConvertIdentifier(convert: Pick<IConvert, 'id'>): number {
    return convert.id;
  }

  compareConvert(o1: Pick<IConvert, 'id'> | null, o2: Pick<IConvert, 'id'> | null): boolean {
    return o1 && o2 ? this.getConvertIdentifier(o1) === this.getConvertIdentifier(o2) : o1 === o2;
  }

  addConvertToCollectionIfMissing<Type extends Pick<IConvert, 'id'>>(
    convertCollection: Type[],
    ...convertsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const converts: Type[] = convertsToCheck.filter(isPresent);
    if (converts.length > 0) {
      const convertCollectionIdentifiers = convertCollection.map(convertItem => this.getConvertIdentifier(convertItem));
      const convertsToAdd = converts.filter(convertItem => {
        const convertIdentifier = this.getConvertIdentifier(convertItem);
        if (convertCollectionIdentifiers.includes(convertIdentifier)) {
          return false;
        }
        convertCollectionIdentifiers.push(convertIdentifier);
        return true;
      });
      return [...convertsToAdd, ...convertCollection];
    }
    return convertCollection;
  }

  protected convertDateFromClient<T extends IConvert | NewConvert | PartialUpdateConvert>(convert: T): RestOf<T> {
    return {
      ...convert,
      createdAt: convert.createdAt?.toJSON() ?? null,
      updatedAt: convert.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restConvert: RestConvert): IConvert {
    return {
      ...restConvert,
      createdAt: restConvert.createdAt ? dayjs(restConvert.createdAt) : undefined,
      updatedAt: restConvert.updatedAt ? dayjs(restConvert.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestConvert>): HttpResponse<IConvert> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestConvert[]>): HttpResponse<IConvert[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
