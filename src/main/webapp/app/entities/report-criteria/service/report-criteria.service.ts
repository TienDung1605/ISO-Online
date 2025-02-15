import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReportCriteria, NewReportCriteria } from '../report-criteria.model';

export type PartialUpdateReportCriteria = Partial<IReportCriteria> & Pick<IReportCriteria, 'id'>;

type RestOf<T extends IReportCriteria | NewReportCriteria> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestReportCriteria = RestOf<IReportCriteria>;

export type NewRestReportCriteria = RestOf<NewReportCriteria>;

export type PartialUpdateRestReportCriteria = RestOf<PartialUpdateReportCriteria>;

export type EntityResponseType = HttpResponse<IReportCriteria>;
export type EntityArrayResponseType = HttpResponse<IReportCriteria[]>;

@Injectable({ providedIn: 'root' })
export class ReportCriteriaService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/report-criteria');

  create(reportCriteria: NewReportCriteria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reportCriteria);
    return this.http
      .post<RestReportCriteria>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(reportCriteria: IReportCriteria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reportCriteria);
    return this.http
      .put<RestReportCriteria>(`${this.resourceUrl}/${this.getReportCriteriaIdentifier(reportCriteria)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(reportCriteria: PartialUpdateReportCriteria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reportCriteria);
    return this.http
      .patch<RestReportCriteria>(`${this.resourceUrl}/${this.getReportCriteriaIdentifier(reportCriteria)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestReportCriteria>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestReportCriteria[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReportCriteriaIdentifier(reportCriteria: Pick<IReportCriteria, 'id'>): number {
    return reportCriteria.id;
  }

  compareReportCriteria(o1: Pick<IReportCriteria, 'id'> | null, o2: Pick<IReportCriteria, 'id'> | null): boolean {
    return o1 && o2 ? this.getReportCriteriaIdentifier(o1) === this.getReportCriteriaIdentifier(o2) : o1 === o2;
  }

  addReportCriteriaToCollectionIfMissing<Type extends Pick<IReportCriteria, 'id'>>(
    reportCriteriaCollection: Type[],
    ...reportCriteriaToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reportCriteria: Type[] = reportCriteriaToCheck.filter(isPresent);
    if (reportCriteria.length > 0) {
      const reportCriteriaCollectionIdentifiers = reportCriteriaCollection.map(reportCriteriaItem =>
        this.getReportCriteriaIdentifier(reportCriteriaItem),
      );
      const reportCriteriaToAdd = reportCriteria.filter(reportCriteriaItem => {
        const reportCriteriaIdentifier = this.getReportCriteriaIdentifier(reportCriteriaItem);
        if (reportCriteriaCollectionIdentifiers.includes(reportCriteriaIdentifier)) {
          return false;
        }
        reportCriteriaCollectionIdentifiers.push(reportCriteriaIdentifier);
        return true;
      });
      return [...reportCriteriaToAdd, ...reportCriteriaCollection];
    }
    return reportCriteriaCollection;
  }

  protected convertDateFromClient<T extends IReportCriteria | NewReportCriteria | PartialUpdateReportCriteria>(
    reportCriteria: T,
  ): RestOf<T> {
    return {
      ...reportCriteria,
      createdAt: reportCriteria.createdAt?.toJSON() ?? null,
      updatedAt: reportCriteria.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restReportCriteria: RestReportCriteria): IReportCriteria {
    return {
      ...restReportCriteria,
      createdAt: restReportCriteria.createdAt ? dayjs(restReportCriteria.createdAt) : undefined,
      updatedAt: restReportCriteria.updatedAt ? dayjs(restReportCriteria.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestReportCriteria>): HttpResponse<IReportCriteria> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestReportCriteria[]>): HttpResponse<IReportCriteria[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
