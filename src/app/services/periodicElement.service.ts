import { Injectable } from '@angular/core';

import { ELEMENT_DATA } from '../mockedData/periodicElement';
import { PeriodicElement } from '../interfaces/periodicElement.interface';

import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PeriodicElementService {
  getDataFromMock(): Observable<PeriodicElement[]> {
    return of<PeriodicElement[]>(ELEMENT_DATA);
  }
}
