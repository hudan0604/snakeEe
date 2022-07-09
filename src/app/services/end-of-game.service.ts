import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface EndOfGameConfig {
  open: boolean;
  reasonOfEnd?: 'borderTouched' | 'hasCollided';
}

@Injectable({
  providedIn: 'root',
})
export class EndOfGameService {
  endOfGame = new Subject<EndOfGameConfig>();
  endOfGame$ = this.endOfGame.asObservable();
}
