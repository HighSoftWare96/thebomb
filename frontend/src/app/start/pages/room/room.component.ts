import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StartFacadeService } from '../../store/startFacade.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  form: FormGroup;
  subs: Subscription[] = [];

  constructor(
    private startFacade: StartFacadeService,
    private formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      name: ['', [Validators.required]],
      maxPartecipants: [3, [Validators.min(2), Validators.max(8)]]
    });
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.subs.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  createRoom() {
    const room = this.form.value;
    this.startFacade.createRoom(room);
  }

}
