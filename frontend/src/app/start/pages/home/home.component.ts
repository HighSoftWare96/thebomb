import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import rug from 'random-username-generator';
import { Observable, Subscription } from 'rxjs';
import { generateAvatarSeed } from 'src/app/shared/helpers/random';
import { Partecipant } from '../../../shared/interfaces/Partecipant';
import { StartFacadeService } from '../../store/startFacade.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  loggedPartecipant$: Observable<Partecipant>;

  form: FormGroup;
  subs: Subscription[] = [];

  constructor(
    private startFacade: StartFacadeService,
    private formBuilder: FormBuilder
  ) {
    this.loggedPartecipant$ = startFacade.loggedPartecipant$;
    this.form = formBuilder.group({
      name: [rug.generate(), [Validators.required]],
      avatarSeed: [generateAvatarSeed()]
    });
    this.subs.push(
      startFacade.loggedPartecipant$.subscribe((s) => {
        this.form.patchValue({ ...s }, {
          emitEvent: false
        });
      })
    );
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    // ensuring not in any room
    this.startFacade.leaveRoom();
    this.startFacade.refreshPartecipant();
  }

  ngOnDestroy() {
    this.subs.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  createPartecipant() {
    const { name, avatarSeed } = this.form.value;
    this.startFacade.createPartecipant(name, avatarSeed);
  }

}
