import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Partecipant } from '../interfaces/Partecipant';
import { Observable } from 'rxjs';

@Injectable()
export class PartecipantApi {

  constructor(
    private http: HttpClient
  ) { }

  create(partecipant: Partecipant): Observable<{ jwt: string, partecipant: Partecipant }> {
    const endpoint = `${environment.apiBase}/partecipants`;
    return this.http.post(endpoint, {
      ...partecipant
    }, { withCredentials: true }) as any;
  }

  refresh(): Observable<{ jwt: string, partecipant: Partecipant }> {
    const endpoint = `${environment.apiBase}/partecipants/renew`;
    return this.http.post(endpoint, {}, { withCredentials: true }) as any;
  }

}