import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IScript, NewScript } from '../script.model';

export type PartialUpdateScript = Partial<IScript> & Pick<IScript, 'id'>;

type RestOf<T extends IScript | NewScript> = Omit<T, 'timeStart' | 'timeEnd' | 'timeCheck' | 'createdAt' | 'updatedAt'> & {
  timeStart?: string | null;
  timeEnd?: string | null;
  timeCheck?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestScript = RestOf<IScript>;

export type NewRestScript = RestOf<NewScript>;

export type PartialUpdateRestScript = RestOf<PartialUpdateScript>;

export type EntityResponseType = HttpResponse<IScript>;
export type EntityArrayResponseType = HttpResponse<IScript[]>;

@Injectable({ providedIn: 'root' })
export class ScriptService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/scripts');

  create(script: NewScript): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(script);
    return this.http
      .post<RestScript>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(script: IScript): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(script);
    return this.http
      .put<RestScript>(`${this.resourceUrl}/${this.getScriptIdentifier(script)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(script: PartialUpdateScript): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(script);
    return this.http
      .patch<RestScript>(`${this.resourceUrl}/${this.getScriptIdentifier(script)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestScript>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestScript[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getScriptIdentifier(script: Pick<IScript, 'id'>): number {
    return script.id;
  }

  compareScript(o1: Pick<IScript, 'id'> | null, o2: Pick<IScript, 'id'> | null): boolean {
    return o1 && o2 ? this.getScriptIdentifier(o1) === this.getScriptIdentifier(o2) : o1 === o2;
  }

  addScriptToCollectionIfMissing<Type extends Pick<IScript, 'id'>>(
    scriptCollection: Type[],
    ...scriptsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const scripts: Type[] = scriptsToCheck.filter(isPresent);
    if (scripts.length > 0) {
      const scriptCollectionIdentifiers = scriptCollection.map(scriptItem => this.getScriptIdentifier(scriptItem));
      const scriptsToAdd = scripts.filter(scriptItem => {
        const scriptIdentifier = this.getScriptIdentifier(scriptItem);
        if (scriptCollectionIdentifiers.includes(scriptIdentifier)) {
          return false;
        }
        scriptCollectionIdentifiers.push(scriptIdentifier);
        return true;
      });
      return [...scriptsToAdd, ...scriptCollection];
    }
    return scriptCollection;
  }

  protected convertDateFromClient<T extends IScript | NewScript | PartialUpdateScript>(script: T): RestOf<T> {
    return {
      ...script,
      timeStart: script.timeStart?.toJSON() ?? null,
      timeEnd: script.timeEnd?.toJSON() ?? null,
      timeCheck: script.timeCheck?.toJSON() ?? null,
      createdAt: script.createdAt?.toJSON() ?? null,
      updatedAt: script.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restScript: RestScript): IScript {
    return {
      ...restScript,
      timeStart: restScript.timeStart ? dayjs(restScript.timeStart) : undefined,
      timeEnd: restScript.timeEnd ? dayjs(restScript.timeEnd) : undefined,
      timeCheck: restScript.timeCheck ? dayjs(restScript.timeCheck) : undefined,
      createdAt: restScript.createdAt ? dayjs(restScript.createdAt) : undefined,
      updatedAt: restScript.updatedAt ? dayjs(restScript.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestScript>): HttpResponse<IScript> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestScript[]>): HttpResponse<IScript[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
