import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditVizService {

  constructor() { }

  opacity = new Subject<number>();
  scaleColor = new Subject<string>();
}
