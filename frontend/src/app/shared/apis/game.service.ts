import { Room } from '../interfaces/Room';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Partecipant } from '../interfaces/Partecipant';
import { Observable } from 'rxjs';
import { Game } from '../interfaces/Game';

@Injectable()
export class GameApi {

  constructor(
    private http: HttpClient
  ) { }

  start(game: Game): Observable<Game> {
    const endpoint = `${environment.apiBase}/game/start`;
    return this.http.post(endpoint, {
      ...game
    }, { withCredentials: true }) as Observable<Game>;
  }

}