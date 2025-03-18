import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISource, NewSource } from '../source.model';

export type PartialUpdateSource = Partial<ISource> & Pick<ISource, 'id'>;

type RestOf<T extends ISource | NewSource> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestSource = RestOf<ISource>;

export type NewRestSource = RestOf<NewSource>;

export type PartialUpdateRestSource = RestOf<PartialUpdateSource>;

export type EntityResponseType = HttpResponse<ISource>;
export type EntityArrayResponseType = HttpResponse<ISource[]>;

@Injectable({ providedIn: 'root' })
export class SourceService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sources');
  protected getAllTablesUrl = this.applicationConfigService.getEndpointFor('api/sources/tables');
  protected getAllTablesUrl1 = this.applicationConfigService.getEndpointFor('api/sources/list');
  protected getAllTablesUrl2 = this.applicationConfigService.getEndpointFor('api/sources/list-columns');
  getAllTables(): Observable<string[]> {
    return this.http.get<string[]>(this.getAllTablesUrl);
  }
  getListTable(): Observable<any[]> {
    return this.http.get<any>(this.getAllTablesUrl1);
  }
  getListColumns(): Observable<any[]> {
    return this.http.get<any>(this.getAllTablesUrl2);
  }
  getAllSources(): Observable<ISource[]> {
    return this.http.get<ISource[]>(this.resourceUrl);
  }
  create(source: NewSource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(source);
    return this.http
      .post<RestSource>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(source: ISource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(source);
    return this.http
      .put<RestSource>(`${this.resourceUrl}/${this.getSourceIdentifier(source)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(source: PartialUpdateSource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(source);
    return this.http
      .patch<RestSource>(`${this.resourceUrl}/${this.getSourceIdentifier(source)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSource>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSource[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSourceIdentifier(source: Pick<ISource, 'id'>): number {
    return source.id;
  }

  compareSource(o1: Pick<ISource, 'id'> | null, o2: Pick<ISource, 'id'> | null): boolean {
    return o1 && o2 ? this.getSourceIdentifier(o1) === this.getSourceIdentifier(o2) : o1 === o2;
  }

  addSourceToCollectionIfMissing<Type extends Pick<ISource, 'id'>>(
    sourceCollection: Type[],
    ...sourcesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sources: Type[] = sourcesToCheck.filter(isPresent);
    if (sources.length > 0) {
      const sourceCollectionIdentifiers = sourceCollection.map(sourceItem => this.getSourceIdentifier(sourceItem));
      const sourcesToAdd = sources.filter(sourceItem => {
        const sourceIdentifier = this.getSourceIdentifier(sourceItem);
        if (sourceCollectionIdentifiers.includes(sourceIdentifier)) {
          return false;
        }
        sourceCollectionIdentifiers.push(sourceIdentifier);
        return true;
      });
      return [...sourcesToAdd, ...sourceCollection];
    }
    return sourceCollection;
  }

  protected convertDateFromClient<T extends ISource | NewSource | PartialUpdateSource>(source: T): RestOf<T> {
    return {
      ...source,
      createdAt: source.createdAt?.toJSON() ?? null,
      updatedAt: source.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSource: RestSource): ISource {
    return {
      ...restSource,
      createdAt: restSource.createdAt ? dayjs(restSource.createdAt) : undefined,
      updatedAt: restSource.updatedAt ? dayjs(restSource.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSource>): HttpResponse<ISource> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSource[]>): HttpResponse<ISource[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
