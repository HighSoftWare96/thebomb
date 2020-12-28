import { Component, HostListener, OnInit } from '@angular/core';
import { faShareAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ModalComponent } from './../../../shared/interfaces/ModalComponent';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss']
})
export class ManualComponent implements OnInit, ModalComponent {
  faClose = faTimes;
  faShare = faShareAlt;
  modalService;

  @HostListener('document:keydown.escape', ['$event'])
  onEscape() {
    this.modalService.close();
  }

  constructor() { }

  ngOnInit(): void { }

  close() {
    this.modalService.close();
  }

  copyLink() {
    navigator.clipboard.writeText(document.baseURI).then(() => { })
  }
}
