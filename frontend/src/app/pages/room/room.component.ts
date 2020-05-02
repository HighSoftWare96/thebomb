import { Partecipant } from '../../shared/interfaces/Partecipant';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RootFacadeService } from 'src/app/store/rootFacade.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room } from 'src/app/shared/interfaces/Room';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  form: FormGroup;
  subs: Subscription[] = [];

  constructor(
    private rootFacade: RootFacadeService,
    private formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      name: [''],
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
    this.rootFacade.createRoom(room);
  }

}
