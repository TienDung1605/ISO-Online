import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SummarizePlanService {
  private apiUrl = 'https://example.com/api/summarize-plan';
  private fields = 'code,name,inspectionObject,totalInspection ,pointScale ,totalErrorPoints ,totalBbktPoints ,averagePoints ,totalErrors ';

  constructor(private http: HttpClient) {}

  getSummarizePlan(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?fields=${this.fields}`);
  }
}
