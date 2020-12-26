import { StartFacadeService } from './../../store/startFacade.service';
import { Room } from 'src/app/shared/interfaces/Room';
import { Partecipant } from '../../../shared/interfaces/Partecipant';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RootFacadeService } from 'src/app/store/rootFacade.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import rug from 'random-username-generator';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit, OnDestroy {

  loggedPartecipant$: Observable<Partecipant>;
  joiningRoom$: Observable<Room>;

  form: FormGroup;
  subs: Subscription[] = [];

  constructor(
    private startFacade: StartFacadeService,
    private formBuilder: FormBuilder
  ) {
    this.loggedPartecipant$ = startFacade.loggedPartecipant$;
    this.joiningRoom$ = startFacade.currentRoom$;

    this.form = formBuilder.group({
      name: [rug.generate(), [Validators.required]],
      avatarSeed: [''],
      inviteId: ['', [Validators.required]]
    });

    this.generateRandomAvatar();

    this.subs.push(
      startFacade.currentRoom$.subscribe(r => {
        if (!r || !r.inviteId) {
          return;
        }
        this.form.get('inviteId').patchValue(r.inviteId, { emitEvent: false });
      })
    );

    this.subs.push(
      startFacade.loggedPartecipant$.subscribe((s) => {
        if (!s || !s.name) {
          return;
        }
        this.form.get('name').patchValue(s.name, { emitEvent: false });
      })
    );
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.startFacade.refreshPartecipant();
    this.startFacade.loadJoiningRoom()
  }

  ngOnDestroy() {
    this.subs.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  generateRandomAvatar() {
    const randomString = Math.random().toString(36).substring(2, 8);
    this.form.get('avatarSeed').patchValue(randomString);
  }

  createPartecipant() {
    const { name, avatarSeed } = this.form.value;
    this.startFacade.createPartecipant(name, avatarSeed);
  }

  joinRoom() {
    const { name, avatarSeed } = this.form.value;
    this.startFacade.joinRoom(name, avatarSeed);
  }

}
