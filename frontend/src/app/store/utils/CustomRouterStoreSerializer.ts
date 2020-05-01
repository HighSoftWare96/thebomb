import { merge } from 'lodash';

import { RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

import { CustomRouterState } from '../root.reducers';

export class CustomStoreRouteSerializer implements RouterStateSerializer<CustomRouterState> {
  serialize(routeParams: RouterStateSnapshot): CustomRouterState {
    const params = {};
    let route = routeParams.root;
    do {
      // merging dei parametri su tutti i livelli
      merge(params, route.params);
      route = route.firstChild;
    } while (route);
    return {
      url: routeParams.url,
      queryParams: routeParams.root.queryParams,
      params
    };
  }
}
