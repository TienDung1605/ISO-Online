import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISampleReportCriteria, NewSampleReportCriteria } from '../sample-report-criteria.model';

export type PartialUpdateSampleReportCriteria = Partial<ISampleReportCriteria> & Pick<ISampleReportCriteria, 'id'>;

type RestOf<T extends ISampleReportCriteria | NewSampleReportCriteria> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestSampleReportCriteria = RestOf<ISampleReportCriteria>;

export type NewRestSampleReportCriteria = RestOf<NewSampleReportCriteria>;

export type PartialUpdateRestSampleReportCriteria = RestOf<PartialUpdateSampleReportCriteria>;

export type EntityResponseType = HttpResponse<ISampleReportCriteria>;
export type EntityArrayResponseType = HttpResponse<ISampleReportCriteria[]>;

@Injectable({ providedIn: 'root' })
export class SampleReportCriteriaService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sample-report-criteria');

  create(sampleReportCriteria: NewSampleReportCriteria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sampleReportCriteria);
    return this.http
      .post<RestSampleReportCriteria>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(sampleReportCriteria: ISampleReportCriteria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sampleReportCriteria);
    return this.http
      .put<RestSampleReportCriteria>(`${this.resourceUrl}/${this.getSampleReportCriteriaIdentifier(sampleReportCriteria)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(sampleReportCriteria: PartialUpdateSampleReportCriteria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sampleReportCriteria);
    return this.http
      .patch<RestSampleReportCriteria>(`${this.resourceUrl}/${this.getSampleReportCriteriaIdentifier(sampleReportCriteria)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSampleReportCriteria>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSampleReportCriteria[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSampleReportCriteriaIdentifier(sampleReportCriteria: Pick<ISampleReportCriteria, 'id'>): number {
    return sampleReportCriteria.id;
  }

  compareSampleReportCriteria(o1: Pick<ISampleReportCriteria, 'id'> | null, o2: Pick<ISampleReportCriteria, 'id'> | null): boolean {
    return o1 && o2 ? this.getSampleReportCriteriaIdentifier(o1) === this.getSampleReportCriteriaIdentifier(o2) : o1 === o2;
  }

  addSampleReportCriteriaToCollectionIfMissing<Type extends Pick<ISampleReportCriteria, 'id'>>(
    sampleReportCriteriaCollection: Type[],
    ...sampleReportCriteriaToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sampleReportCriteria: Type[] = sampleReportCriteriaToCheck.filter(isPresent);
    if (sampleReportCriteria.length > 0) {
      const sampleReportCriteriaCollectionIdentifiers = sampleReportCriteriaCollection.map(sampleReportCriteriaItem =>
        this.getSampleReportCriteriaIdentifier(sampleReportCriteriaItem),
      );
      const sampleReportCriteriaToAdd = sampleReportCriteria.filter(sampleReportCriteriaItem => {
        const sampleReportCriteriaIdentifier = this.getSampleReportCriteriaIdentifier(sampleReportCriteriaItem);
        if (sampleReportCriteriaCollectionIdentifiers.includes(sampleReportCriteriaIdentifier)) {
          return false;
        }
        sampleReportCriteriaCollectionIdentifiers.push(sampleReportCriteriaIdentifier);
        return true;
      });
      return [...sampleReportCriteriaToAdd, ...sampleReportCriteriaCollection];
    }
    return sampleReportCriteriaCollection;
  }

  protected convertDateFromClient<T extends ISampleReportCriteria | NewSampleReportCriteria | PartialUpdateSampleReportCriteria>(
    sampleReportCriteria: T,
  ): RestOf<T> {
    return {
      ...sampleReportCriteria,
      createdAt: sampleReportCriteria.createdAt?.toJSON() ?? null,
      updatedAt: sampleReportCriteria.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSampleReportCriteria: RestSampleReportCriteria): ISampleReportCriteria {
    return {
      ...restSampleReportCriteria,
      createdAt: restSampleReportCriteria.createdAt ? dayjs(restSampleReportCriteria.createdAt) : undefined,
      updatedAt: restSampleReportCriteria.updatedAt ? dayjs(restSampleReportCriteria.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSampleReportCriteria>): HttpResponse<ISampleReportCriteria> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSampleReportCriteria[]>): HttpResponse<ISampleReportCriteria[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
