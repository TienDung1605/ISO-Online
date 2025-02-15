import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlan, NewPlan } from '../plan.model';

export type PartialUpdatePlan = Partial<IPlan> & Pick<IPlan, 'id'>;

type RestOf<T extends IPlan | NewPlan> = Omit<T, 'timeStart' | 'timeEnd' | 'createdAt' | 'updatedAt'> & {
  timeStart?: string | null;
  timeEnd?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestPlan = RestOf<IPlan>;

export type NewRestPlan = RestOf<NewPlan>;

export type PartialUpdateRestPlan = RestOf<PartialUpdatePlan>;

export type EntityResponseType = HttpResponse<IPlan>;
export type EntityArrayResponseType = HttpResponse<IPlan[]>;

@Injectable({ providedIn: 'root' })
export class PlanService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/plans');

  create(plan: NewPlan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(plan);
    return this.http.post<RestPlan>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(plan: IPlan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(plan);
    return this.http
      .put<RestPlan>(`${this.resourceUrl}/${this.getPlanIdentifier(plan)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(plan: PartialUpdatePlan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(plan);
    return this.http
      .patch<RestPlan>(`${this.resourceUrl}/${this.getPlanIdentifier(plan)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPlan>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPlan[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPlanIdentifier(plan: Pick<IPlan, 'id'>): number {
    return plan.id;
  }

  comparePlan(o1: Pick<IPlan, 'id'> | null, o2: Pick<IPlan, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlanIdentifier(o1) === this.getPlanIdentifier(o2) : o1 === o2;
  }

  addPlanToCollectionIfMissing<Type extends Pick<IPlan, 'id'>>(
    planCollection: Type[],
    ...plansToCheck: (Type | null | undefined)[]
  ): Type[] {
    const plans: Type[] = plansToCheck.filter(isPresent);
    if (plans.length > 0) {
      const planCollectionIdentifiers = planCollection.map(planItem => this.getPlanIdentifier(planItem));
      const plansToAdd = plans.filter(planItem => {
        const planIdentifier = this.getPlanIdentifier(planItem);
        if (planCollectionIdentifiers.includes(planIdentifier)) {
          return false;
        }
        planCollectionIdentifiers.push(planIdentifier);
        return true;
      });
      return [...plansToAdd, ...planCollection];
    }
    return planCollection;
  }

  protected convertDateFromClient<T extends IPlan | NewPlan | PartialUpdatePlan>(plan: T): RestOf<T> {
    return {
      ...plan,
      timeStart: plan.timeStart?.toJSON() ?? null,
      timeEnd: plan.timeEnd?.toJSON() ?? null,
      createdAt: plan.createdAt?.toJSON() ?? null,
      updatedAt: plan.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPlan: RestPlan): IPlan {
    return {
      ...restPlan,
      timeStart: restPlan.timeStart ? dayjs(restPlan.timeStart) : undefined,
      timeEnd: restPlan.timeEnd ? dayjs(restPlan.timeEnd) : undefined,
      createdAt: restPlan.createdAt ? dayjs(restPlan.createdAt) : undefined,
      updatedAt: restPlan.updatedAt ? dayjs(restPlan.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPlan>): HttpResponse<IPlan> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPlan[]>): HttpResponse<IPlan[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
