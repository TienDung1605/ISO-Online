import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReportType, NewReportType } from '../report-type.model';

export type PartialUpdateReportType = Partial<IReportType> & Pick<IReportType, 'id'>;

type RestOf<T extends IReportType | NewReportType> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestReportType = RestOf<IReportType>;

export type NewRestReportType = RestOf<NewReportType>;

export type PartialUpdateRestReportType = RestOf<PartialUpdateReportType>;

export type EntityResponseType = HttpResponse<IReportType>;
export type EntityArrayResponseType = HttpResponse<IReportType[]>;

@Injectable({ providedIn: 'root' })
export class ReportTypeService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/report-types');

  getAllCheckTargets(): Observable<IReportType[]> {
    return this.http.get<IReportType[]>(this.resourceUrl);
  }

  create(reportType: NewReportType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reportType);
    return this.http
      .post<RestReportType>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(reportType: IReportType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reportType);
    return this.http
      .put<RestReportType>(`${this.resourceUrl}/${this.getReportTypeIdentifier(reportType)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(reportType: PartialUpdateReportType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reportType);
    return this.http
      .patch<RestReportType>(`${this.resourceUrl}/${this.getReportTypeIdentifier(reportType)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestReportType>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestReportType[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReportTypeIdentifier(reportType: Pick<IReportType, 'id'>): number {
    return reportType.id;
  }

  compareReportType(o1: Pick<IReportType, 'id'> | null, o2: Pick<IReportType, 'id'> | null): boolean {
    return o1 && o2 ? this.getReportTypeIdentifier(o1) === this.getReportTypeIdentifier(o2) : o1 === o2;
  }

  addReportTypeToCollectionIfMissing<Type extends Pick<IReportType, 'id'>>(
    reportTypeCollection: Type[],
    ...reportTypesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reportTypes: Type[] = reportTypesToCheck.filter(isPresent);
    if (reportTypes.length > 0) {
      const reportTypeCollectionIdentifiers = reportTypeCollection.map(reportTypeItem => this.getReportTypeIdentifier(reportTypeItem));
      const reportTypesToAdd = reportTypes.filter(reportTypeItem => {
        const reportTypeIdentifier = this.getReportTypeIdentifier(reportTypeItem);
        if (reportTypeCollectionIdentifiers.includes(reportTypeIdentifier)) {
          return false;
        }
        reportTypeCollectionIdentifiers.push(reportTypeIdentifier);
        return true;
      });
      return [...reportTypesToAdd, ...reportTypeCollection];
    }
    return reportTypeCollection;
  }

  protected convertDateFromClient<T extends IReportType | NewReportType | PartialUpdateReportType>(reportType: T): RestOf<T> {
    return {
      ...reportType,
      createdAt: reportType.createdAt?.toJSON() ?? null,
      updatedAt: reportType.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restReportType: RestReportType): IReportType {
    return {
      ...restReportType,
      createdAt: restReportType.createdAt ? dayjs(restReportType.createdAt) : undefined,
      updatedAt: restReportType.updatedAt ? dayjs(restReportType.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestReportType>): HttpResponse<IReportType> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestReportType[]>): HttpResponse<IReportType[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
