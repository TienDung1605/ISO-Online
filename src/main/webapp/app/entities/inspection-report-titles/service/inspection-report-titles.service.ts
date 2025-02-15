import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInspectionReportTitles, NewInspectionReportTitles } from '../inspection-report-titles.model';

export type PartialUpdateInspectionReportTitles = Partial<IInspectionReportTitles> & Pick<IInspectionReportTitles, 'id'>;

type RestOf<T extends IInspectionReportTitles | NewInspectionReportTitles> = Omit<T, 'timeCreate' | 'timeUpdate'> & {
  timeCreate?: string | null;
  timeUpdate?: string | null;
};

export type RestInspectionReportTitles = RestOf<IInspectionReportTitles>;

export type NewRestInspectionReportTitles = RestOf<NewInspectionReportTitles>;

export type PartialUpdateRestInspectionReportTitles = RestOf<PartialUpdateInspectionReportTitles>;

export type EntityResponseType = HttpResponse<IInspectionReportTitles>;
export type EntityArrayResponseType = HttpResponse<IInspectionReportTitles[]>;

@Injectable({ providedIn: 'root' })
export class InspectionReportTitlesService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/inspection-report-titles');

  create(inspectionReportTitles: NewInspectionReportTitles): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(inspectionReportTitles);
    return this.http
      .post<RestInspectionReportTitles>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(inspectionReportTitles: IInspectionReportTitles): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(inspectionReportTitles);
    return this.http
      .put<RestInspectionReportTitles>(`${this.resourceUrl}/${this.getInspectionReportTitlesIdentifier(inspectionReportTitles)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(inspectionReportTitles: PartialUpdateInspectionReportTitles): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(inspectionReportTitles);
    return this.http
      .patch<RestInspectionReportTitles>(`${this.resourceUrl}/${this.getInspectionReportTitlesIdentifier(inspectionReportTitles)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInspectionReportTitles>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInspectionReportTitles[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInspectionReportTitlesIdentifier(inspectionReportTitles: Pick<IInspectionReportTitles, 'id'>): number {
    return inspectionReportTitles.id;
  }

  compareInspectionReportTitles(o1: Pick<IInspectionReportTitles, 'id'> | null, o2: Pick<IInspectionReportTitles, 'id'> | null): boolean {
    return o1 && o2 ? this.getInspectionReportTitlesIdentifier(o1) === this.getInspectionReportTitlesIdentifier(o2) : o1 === o2;
  }

  addInspectionReportTitlesToCollectionIfMissing<Type extends Pick<IInspectionReportTitles, 'id'>>(
    inspectionReportTitlesCollection: Type[],
    ...inspectionReportTitlesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const inspectionReportTitles: Type[] = inspectionReportTitlesToCheck.filter(isPresent);
    if (inspectionReportTitles.length > 0) {
      const inspectionReportTitlesCollectionIdentifiers = inspectionReportTitlesCollection.map(inspectionReportTitlesItem =>
        this.getInspectionReportTitlesIdentifier(inspectionReportTitlesItem),
      );
      const inspectionReportTitlesToAdd = inspectionReportTitles.filter(inspectionReportTitlesItem => {
        const inspectionReportTitlesIdentifier = this.getInspectionReportTitlesIdentifier(inspectionReportTitlesItem);
        if (inspectionReportTitlesCollectionIdentifiers.includes(inspectionReportTitlesIdentifier)) {
          return false;
        }
        inspectionReportTitlesCollectionIdentifiers.push(inspectionReportTitlesIdentifier);
        return true;
      });
      return [...inspectionReportTitlesToAdd, ...inspectionReportTitlesCollection];
    }
    return inspectionReportTitlesCollection;
  }

  protected convertDateFromClient<T extends IInspectionReportTitles | NewInspectionReportTitles | PartialUpdateInspectionReportTitles>(
    inspectionReportTitles: T,
  ): RestOf<T> {
    return {
      ...inspectionReportTitles,
      timeCreate: inspectionReportTitles.timeCreate?.toJSON() ?? null,
      timeUpdate: inspectionReportTitles.timeUpdate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restInspectionReportTitles: RestInspectionReportTitles): IInspectionReportTitles {
    return {
      ...restInspectionReportTitles,
      timeCreate: restInspectionReportTitles.timeCreate ? dayjs(restInspectionReportTitles.timeCreate) : undefined,
      timeUpdate: restInspectionReportTitles.timeUpdate ? dayjs(restInspectionReportTitles.timeUpdate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInspectionReportTitles>): HttpResponse<IInspectionReportTitles> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInspectionReportTitles[]>): HttpResponse<IInspectionReportTitles[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
