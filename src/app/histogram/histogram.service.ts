import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistogramService {

  geometry = new Subject<string>();
  createHistogram = new Subject<string>();
  histogram = new Subject<string>();

  constructor() { }
}
