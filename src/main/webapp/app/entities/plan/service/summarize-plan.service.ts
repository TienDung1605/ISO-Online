import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SummarizePlanService {
  protected applicationConfigService = inject(ApplicationConfigService);
  private apiUrl = 'https://example.com/api/summarize-plan';
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/plans');
  private fields = 'code,name,inspectionObject,totalInspection ,pointScale ,totalErrorPoints ,totalBbktPoints ,averagePoints ,totalErrors ';

  constructor(private http: HttpClient) {}

  getSummarizePlan(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?fields=${this.fields}`);
  }

  getStaitcatial(planId: number): Observable<any> {
    return this.http.post<any[]>(`${this.resourceUrl}/statistical/${planId}`, { observe: 'response' });
  }

  getAllPlanStatistical(planId: number, reportId: number): Observable<any> {
    return this.http.post<any[]>(`${this.resourceUrl}/statistical/plan/${planId}/report`, reportId, { observe: 'response' });
  }
}
