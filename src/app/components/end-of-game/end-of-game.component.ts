import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  EndOfGameConfig,
  EndOfGameService,
} from 'src/app/services/end-of-game.service';

@Component({
  selector: 'sna-end-of-game',
  templateUrl: './end-of-game.component.html',
  styleUrls: ['./end-of-game.component.scss'],
})
export class EndOfGameComponent implements OnInit, OnDestroy {
  endOfGameSubscription: Subscription | undefined;
  endOfGame: EndOfGameConfig = { open: false };
  constructor(private endOfGameService: EndOfGameService) {}

  ngOnInit(): void {
    this.endOfGameSubscription = this.endOfGameService.endOfGame$.subscribe(
      (endOfGame) => {
        this.endOfGame = endOfGame;
      }
    );
  }

  ngOnDestroy(): void {
    this.endOfGameSubscription?.unsubscribe();
  }
}
