import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFields, NewFields } from '../fields.model';

export type PartialUpdateFields = Partial<IFields> & Pick<IFields, 'id'>;

type RestOf<T extends IFields | NewFields> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestFields = RestOf<IFields>;

export type NewRestFields = RestOf<NewFields>;

export type PartialUpdateRestFields = RestOf<PartialUpdateFields>;

export type EntityResponseType = HttpResponse<IFields>;
export type EntityArrayResponseType = HttpResponse<IFields[]>;

@Injectable({ providedIn: 'root' })
export class FieldsService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fields');

  create(fields: NewFields): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fields);
    return this.http
      .post<RestFields>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(fields: IFields): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fields);
    return this.http
      .put<RestFields>(`${this.resourceUrl}/${this.getFieldsIdentifier(fields)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(fields: PartialUpdateFields): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fields);
    return this.http
      .patch<RestFields>(`${this.resourceUrl}/${this.getFieldsIdentifier(fields)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFields>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFields[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFieldsIdentifier(fields: Pick<IFields, 'id'>): number {
    return fields.id;
  }

  compareFields(o1: Pick<IFields, 'id'> | null, o2: Pick<IFields, 'id'> | null): boolean {
    return o1 && o2 ? this.getFieldsIdentifier(o1) === this.getFieldsIdentifier(o2) : o1 === o2;
  }

  addFieldsToCollectionIfMissing<Type extends Pick<IFields, 'id'>>(
    fieldsCollection: Type[],
    ...fieldsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const fields: Type[] = fieldsToCheck.filter(isPresent);
    if (fields.length > 0) {
      const fieldsCollectionIdentifiers = fieldsCollection.map(fieldsItem => this.getFieldsIdentifier(fieldsItem));
      const fieldsToAdd = fields.filter(fieldsItem => {
        const fieldsIdentifier = this.getFieldsIdentifier(fieldsItem);
        if (fieldsCollectionIdentifiers.includes(fieldsIdentifier)) {
          return false;
        }
        fieldsCollectionIdentifiers.push(fieldsIdentifier);
        return true;
      });
      return [...fieldsToAdd, ...fieldsCollection];
    }
    return fieldsCollection;
  }

  protected convertDateFromClient<T extends IFields | NewFields | PartialUpdateFields>(fields: T): RestOf<T> {
    return {
      ...fields,
      createdAt: fields.createdAt?.toJSON() ?? null,
      updatedAt: fields.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFields: RestFields): IFields {
    return {
      ...restFields,
      createdAt: restFields.createdAt ? dayjs(restFields.createdAt) : undefined,
      updatedAt: restFields.updatedAt ? dayjs(restFields.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFields>): HttpResponse<IFields> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFields[]>): HttpResponse<IFields[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
