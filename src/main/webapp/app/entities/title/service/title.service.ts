import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITitle, NewTitle } from '../title.model';

export type PartialUpdateTitle = Partial<ITitle> & Pick<ITitle, 'id'>;

type RestOf<T extends ITitle | NewTitle> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestTitle = RestOf<ITitle>;

export type NewRestTitle = RestOf<NewTitle>;

export type PartialUpdateRestTitle = RestOf<PartialUpdateTitle>;

export type EntityResponseType = HttpResponse<ITitle>;
export type EntityArrayResponseType = HttpResponse<ITitle[]>;

@Injectable({ providedIn: 'root' })
export class TitleService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/titles');
  protected resourceUrl1 = this.applicationConfigService.getEndpointFor('api/titles/all');

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get<ITitle[]>(this.resourceUrl).pipe(map(converts => converts.some(convert => convert.name === name)));
  }

  create(title: NewTitle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(title);
    return this.http.post<RestTitle>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }
  getAllTitles(): Observable<EntityArrayResponseType> {
    return this.http.get<any[]>(this.resourceUrl1, { observe: 'response' });
  }
  update(title: ITitle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(title);
    return this.http
      .put<RestTitle>(`${this.resourceUrl}/${this.getTitleIdentifier(title)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(title: PartialUpdateTitle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(title);
    return this.http
      .patch<RestTitle>(`${this.resourceUrl}/${this.getTitleIdentifier(title)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTitle>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTitle[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTitleIdentifier(title: Pick<ITitle, 'id'>): number {
    return title.id;
  }

  compareTitle(o1: Pick<ITitle, 'id'> | null, o2: Pick<ITitle, 'id'> | null): boolean {
    return o1 && o2 ? this.getTitleIdentifier(o1) === this.getTitleIdentifier(o2) : o1 === o2;
  }

  addTitleToCollectionIfMissing<Type extends Pick<ITitle, 'id'>>(
    titleCollection: Type[],
    ...titlesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const titles: Type[] = titlesToCheck.filter(isPresent);
    if (titles.length > 0) {
      const titleCollectionIdentifiers = titleCollection.map(titleItem => this.getTitleIdentifier(titleItem));
      const titlesToAdd = titles.filter(titleItem => {
        const titleIdentifier = this.getTitleIdentifier(titleItem);
        if (titleCollectionIdentifiers.includes(titleIdentifier)) {
          return false;
        }
        titleCollectionIdentifiers.push(titleIdentifier);
        return true;
      });
      return [...titlesToAdd, ...titleCollection];
    }
    return titleCollection;
  }

  protected convertDateFromClient<T extends ITitle | NewTitle | PartialUpdateTitle>(title: T): RestOf<T> {
    return {
      ...title,
      createdAt: title.createdAt?.toJSON() ?? null,
      updatedAt: title.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTitle: RestTitle): ITitle {
    return {
      ...restTitle,
      createdAt: restTitle.createdAt ? dayjs(restTitle.createdAt) : undefined,
      updatedAt: restTitle.updatedAt ? dayjs(restTitle.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTitle>): HttpResponse<ITitle> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTitle[]>): HttpResponse<ITitle[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
