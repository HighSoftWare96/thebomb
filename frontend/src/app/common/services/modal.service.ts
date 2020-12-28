import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { ModalComponent } from './../../shared/interfaces/ModalComponent';

@Injectable()
export class ModalService {
  activeModalRef: ComponentRef<ModalComponent>;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
  ) { }

  open(viewRef: ViewContainerRef, component) {
    this.close();
    viewRef.clear();
    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);
    let componentRef = viewRef.createComponent<ModalComponent>(componentFactory);
    componentRef.instance.modalService = this;
    this.activeModalRef = componentRef;
  }

  close() {
    if (!this.activeModalRef) {
      return;
    }

    this._appRef.detachView(this.activeModalRef.hostView);
    this.activeModalRef.destroy();
    this.activeModalRef = null;
  }
}