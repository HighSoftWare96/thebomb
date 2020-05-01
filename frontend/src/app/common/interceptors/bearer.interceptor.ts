import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

@Injectable()
export class BearerInterceptor implements HttpInterceptor {
  jwt = '';

  constructor() { }

  setJwt(jwt: string) {
    this.jwt = jwt;
  }

  unSetJwt() {
    this.jwt = '';
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.jwt}`
      }
    });
    return next.handle(req);
  }

}