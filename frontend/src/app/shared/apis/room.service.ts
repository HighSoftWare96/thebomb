import { Room } from './../interfaces/Room';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Partecipant } from '../interfaces/Partecipant';
import { Observable } from 'rxjs';

@Injectable()
export class RoomApi {

  constructor(
    private http: HttpClient
  ) { }

  create(room: Room): Observable<Room> {
    const endpoint = `${environment.apiBase}/rooms`;
    return this.http.post(endpoint, {
      ...room
    }, { withCredentials: true }) as Observable<Room>;
  }

  join(inviteId: string): Observable<Room> {
    const endpoint = `${environment.apiBase}/rooms/join/${inviteId}`;
    return this.http.post(endpoint, {}, { withCredentials: true }) as Observable<Room>;
  }

  getByInviteId(inviteId: string): Observable<Room> {
    const endpoint = `${environment.apiBase}/rooms/${inviteId}`;
    return this.http.get(endpoint, { withCredentials: true }) as Observable<Room>;
  }

}