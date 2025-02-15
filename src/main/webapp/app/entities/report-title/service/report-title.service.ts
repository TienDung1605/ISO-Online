import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReportTitle, NewReportTitle } from '../report-title.model';

export type PartialUpdateReportTitle = Partial<IReportTitle> & Pick<IReportTitle, 'id'>;

type RestOf<T extends IReportTitle | NewReportTitle> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestReportTitle = RestOf<IReportTitle>;

export type NewRestReportTitle = RestOf<NewReportTitle>;

export type PartialUpdateRestReportTitle = RestOf<PartialUpdateReportTitle>;

export type EntityResponseType = HttpResponse<IReportTitle>;
export type EntityArrayResponseType = HttpResponse<IReportTitle[]>;

@Injectable({ providedIn: 'root' })
export class ReportTitleService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/report-titles');

  create(reportTitle: NewReportTitle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reportTitle);
    return this.http
      .post<RestReportTitle>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(reportTitle: IReportTitle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reportTitle);
    return this.http
      .put<RestReportTitle>(`${this.resourceUrl}/${this.getReportTitleIdentifier(reportTitle)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(reportTitle: PartialUpdateReportTitle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reportTitle);
    return this.http
      .patch<RestReportTitle>(`${this.resourceUrl}/${this.getReportTitleIdentifier(reportTitle)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestReportTitle>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestReportTitle[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReportTitleIdentifier(reportTitle: Pick<IReportTitle, 'id'>): number {
    return reportTitle.id;
  }

  compareReportTitle(o1: Pick<IReportTitle, 'id'> | null, o2: Pick<IReportTitle, 'id'> | null): boolean {
    return o1 && o2 ? this.getReportTitleIdentifier(o1) === this.getReportTitleIdentifier(o2) : o1 === o2;
  }

  addReportTitleToCollectionIfMissing<Type extends Pick<IReportTitle, 'id'>>(
    reportTitleCollection: Type[],
    ...reportTitlesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reportTitles: Type[] = reportTitlesToCheck.filter(isPresent);
    if (reportTitles.length > 0) {
      const reportTitleCollectionIdentifiers = reportTitleCollection.map(reportTitleItem => this.getReportTitleIdentifier(reportTitleItem));
      const reportTitlesToAdd = reportTitles.filter(reportTitleItem => {
        const reportTitleIdentifier = this.getReportTitleIdentifier(reportTitleItem);
        if (reportTitleCollectionIdentifiers.includes(reportTitleIdentifier)) {
          return false;
        }
        reportTitleCollectionIdentifiers.push(reportTitleIdentifier);
        return true;
      });
      return [...reportTitlesToAdd, ...reportTitleCollection];
    }
    return reportTitleCollection;
  }

  protected convertDateFromClient<T extends IReportTitle | NewReportTitle | PartialUpdateReportTitle>(reportTitle: T): RestOf<T> {
    return {
      ...reportTitle,
      createdAt: reportTitle.createdAt?.toJSON() ?? null,
      updatedAt: reportTitle.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restReportTitle: RestReportTitle): IReportTitle {
    return {
      ...restReportTitle,
      createdAt: restReportTitle.createdAt ? dayjs(restReportTitle.createdAt) : undefined,
      updatedAt: restReportTitle.updatedAt ? dayjs(restReportTitle.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestReportTitle>): HttpResponse<IReportTitle> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestReportTitle[]>): HttpResponse<IReportTitle[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
