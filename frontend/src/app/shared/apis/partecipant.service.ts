import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Partecipant } from '../interfaces/Partecipant';
import { environment } from './../../../environments/environment';

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

  update(partecipant: Partial<Partecipant> & { id: number }): Observable<Partecipant> {
    const endpoint = `${environment.apiBase}/partecipants/${partecipant.id}`;
    return this.http.patch(endpoint, {
      ...partecipant
    }, { withCredentials: true }) as any;
  }

  refresh(): Observable<{ jwt: string, partecipant: Partecipant }> {
    const endpoint = `${environment.apiBase}/partecipants/renew`;
    return this.http.post(endpoint, {}, { withCredentials: true }) as any;
  }

}