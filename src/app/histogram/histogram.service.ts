import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistogramService {

  rectangle = new Subject<string>();

  constructor() { }
}
