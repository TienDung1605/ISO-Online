import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFrequency, NewFrequency } from '../frequency.model';

export type PartialUpdateFrequency = Partial<IFrequency> & Pick<IFrequency, 'id'>;

type RestOf<T extends IFrequency | NewFrequency> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestFrequency = RestOf<IFrequency>;

export type NewRestFrequency = RestOf<NewFrequency>;

export type PartialUpdateRestFrequency = RestOf<PartialUpdateFrequency>;

export type EntityResponseType = HttpResponse<IFrequency>;
export type EntityArrayResponseType = HttpResponse<IFrequency[]>;

@Injectable({ providedIn: 'root' })
export class FrequencyService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/frequencies');

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get<IFrequency[]>(this.resourceUrl).pipe(map(converts => converts.some(convert => convert.name === name)));
  }

  create(frequency: NewFrequency): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(frequency);
    return this.http
      .post<RestFrequency>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(frequency: IFrequency): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(frequency);
    return this.http
      .put<RestFrequency>(`${this.resourceUrl}/${this.getFrequencyIdentifier(frequency)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(frequency: PartialUpdateFrequency): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(frequency);
    return this.http
      .patch<RestFrequency>(`${this.resourceUrl}/${this.getFrequencyIdentifier(frequency)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFrequency>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFrequency[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFrequencyIdentifier(frequency: Pick<IFrequency, 'id'>): number {
    return frequency.id;
  }

  compareFrequency(o1: Pick<IFrequency, 'id'> | null, o2: Pick<IFrequency, 'id'> | null): boolean {
    return o1 && o2 ? this.getFrequencyIdentifier(o1) === this.getFrequencyIdentifier(o2) : o1 === o2;
  }

  addFrequencyToCollectionIfMissing<Type extends Pick<IFrequency, 'id'>>(
    frequencyCollection: Type[],
    ...frequenciesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const frequencies: Type[] = frequenciesToCheck.filter(isPresent);
    if (frequencies.length > 0) {
      const frequencyCollectionIdentifiers = frequencyCollection.map(frequencyItem => this.getFrequencyIdentifier(frequencyItem));
      const frequenciesToAdd = frequencies.filter(frequencyItem => {
        const frequencyIdentifier = this.getFrequencyIdentifier(frequencyItem);
        if (frequencyCollectionIdentifiers.includes(frequencyIdentifier)) {
          return false;
        }
        frequencyCollectionIdentifiers.push(frequencyIdentifier);
        return true;
      });
      return [...frequenciesToAdd, ...frequencyCollection];
    }
    return frequencyCollection;
  }

  protected convertDateFromClient<T extends IFrequency | NewFrequency | PartialUpdateFrequency>(frequency: T): RestOf<T> {
    return {
      ...frequency,
      createdAt: frequency.createdAt?.toJSON() ?? null,
      updatedAt: frequency.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFrequency: RestFrequency): IFrequency {
    return {
      ...restFrequency,
      createdAt: restFrequency.createdAt ? dayjs(restFrequency.createdAt) : undefined,
      updatedAt: restFrequency.updatedAt ? dayjs(restFrequency.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFrequency>): HttpResponse<IFrequency> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFrequency[]>): HttpResponse<IFrequency[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
