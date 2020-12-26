import { Observable } from "rxjs";

// see https://scotch.io/courses/routing-angular-2-applications/candeactivate
// implementing this interface with a component in angular you can implement a candeactivate
// guard that automatically checks if there is the canDeactivate function and
// it allows to navigate out of the route or not
export default interface LockableComponent {
  allowRedirect: boolean;
  canDeactivate?(): boolean;
  canDeactivate$?: Observable<boolean>;
  onLeaving?(): any;
}