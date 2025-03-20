import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISampleReport, NewSampleReport } from '../sample-report.model';

export type PartialUpdateSampleReport = Partial<ISampleReport> & Pick<ISampleReport, 'id'>;

type RestOf<T extends ISampleReport | NewSampleReport> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestSampleReport = RestOf<ISampleReport>;

export type NewRestSampleReport = RestOf<NewSampleReport>;

export type PartialUpdateRestSampleReport = RestOf<PartialUpdateSampleReport>;

export type EntityResponseType = HttpResponse<ISampleReport>;
export type EntityArrayResponseType = HttpResponse<ISampleReport[]>;

@Injectable({ providedIn: 'root' })
export class SampleReportService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sample-reports');
  protected resourceUrl1 = this.applicationConfigService.getEndpointFor('api/sample-reports/list');
  protected resourceUrl2 = this.applicationConfigService.getEndpointFor('api/sample-reports/all');
  protected resourceUrl3 = this.applicationConfigService.getEndpointFor('api/sample-reports/detail');

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get<ISampleReport[]>(this.resourceUrl).pipe(map(converts => converts.some(convert => convert.name === name)));
  }

  create(sampleReport: NewSampleReport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sampleReport);
    return this.http
      .post<RestSampleReport>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }
  getListSuggestions(body: any): Observable<EntityArrayResponseType> {
    return this.http.post<any[]>(this.resourceUrl1, body, { observe: 'response' });
  }
  getListSampleReports(): Observable<any> {
    return this.http.get<any[]>(this.resourceUrl2, { observe: 'response' });
  }
  getSampleReportDetail(code: string): Observable<any> {
    return this.http.get<any>(`${this.resourceUrl3}/${code}`, { observe: 'response' });
  }
  update(sampleReport: ISampleReport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sampleReport);
    return this.http
      .put<RestSampleReport>(`${this.resourceUrl}/${this.getSampleReportIdentifier(sampleReport)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(sampleReport: PartialUpdateSampleReport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sampleReport);
    return this.http
      .patch<RestSampleReport>(`${this.resourceUrl}/${this.getSampleReportIdentifier(sampleReport)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSampleReport>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSampleReport[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSampleReportIdentifier(sampleReport: Pick<ISampleReport, 'id'>): number {
    return sampleReport.id;
  }

  compareSampleReport(o1: Pick<ISampleReport, 'id'> | null, o2: Pick<ISampleReport, 'id'> | null): boolean {
    return o1 && o2 ? this.getSampleReportIdentifier(o1) === this.getSampleReportIdentifier(o2) : o1 === o2;
  }

  addSampleReportToCollectionIfMissing<Type extends Pick<ISampleReport, 'id'>>(
    sampleReportCollection: Type[],
    ...sampleReportsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sampleReports: Type[] = sampleReportsToCheck.filter(isPresent);
    if (sampleReports.length > 0) {
      const sampleReportCollectionIdentifiers = sampleReportCollection.map(sampleReportItem =>
        this.getSampleReportIdentifier(sampleReportItem),
      );
      const sampleReportsToAdd = sampleReports.filter(sampleReportItem => {
        const sampleReportIdentifier = this.getSampleReportIdentifier(sampleReportItem);
        if (sampleReportCollectionIdentifiers.includes(sampleReportIdentifier)) {
          return false;
        }
        sampleReportCollectionIdentifiers.push(sampleReportIdentifier);
        return true;
      });
      return [...sampleReportsToAdd, ...sampleReportCollection];
    }
    return sampleReportCollection;
  }

  protected convertDateFromClient<T extends ISampleReport | NewSampleReport | PartialUpdateSampleReport>(sampleReport: T): RestOf<T> {
    return {
      ...sampleReport,
      createdAt: sampleReport.createdAt?.toJSON() ?? null,
      updatedAt: sampleReport.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSampleReport: RestSampleReport): ISampleReport {
    return {
      ...restSampleReport,
      createdAt: restSampleReport.createdAt ? dayjs(restSampleReport.createdAt) : undefined,
      updatedAt: restSampleReport.updatedAt ? dayjs(restSampleReport.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSampleReport>): HttpResponse<ISampleReport> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSampleReport[]>): HttpResponse<ISampleReport[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
