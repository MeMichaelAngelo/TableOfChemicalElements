import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { PeriodicElementService } from '../services/periodicElement.service';
import { PeriodicElement } from '../interfaces/periodicElement.interface';
import { EditPageComponent } from '../edit-page/edit-page.component';

import { RxState } from '@rx-angular/state';
import { debounceTime, map, Subject } from 'rxjs';
import { combineLatestWith, startWith } from 'rxjs/operators';

interface State {
  periodic: PeriodicElement[];
  tableColumns: {
    table: string[];
    tableWithAction: string[];
  };
  filteredTable: PeriodicElement[];
}

@Component({
  selector: 'main-page',
  templateUrl: 'main-page.component.html',
  styleUrl: 'main-page.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    CommonModule,
    MatInputModule,
    FormsModule,
  ],
  providers: [PeriodicElementService, RxState],
})
export class MainPageComponent implements OnInit {
  dialog = inject(MatDialog);
  service = inject(PeriodicElementService);
  cdr = inject(ChangeDetectorRef);
  state = inject(RxState<State>);

  searchInput: string = '';
  private searchTextSubject$ = new Subject<string>();

  periodic$ = this.state.select('periodic');
  tableColumns$ = this.state.select('tableColumns');
  filteredTable$ = this.state.select('filteredTable');

  initHandler$ = this.service.getDataFromMock();
  search$ = new Subject<string>();

  searchHandler$ = this.searchTextSubject$
    .pipe(debounceTime(2000), startWith(''))
    .pipe(combineLatestWith(this.service.getDataFromMock()))
    .pipe(
      map(([search, allData]) => {
        return search
          ? allData.filter((result) => result.name.includes(search))
          : allData;
      })
    );

  constructor() {
    this.state.connect('periodic', this.initHandler$);
    this.state.connect('tableColumns', this.initHandler$, (state) => {
      const tableColumns = Object.keys(state.periodic[0]);
      return {
        table: [...tableColumns],
        tableWithAction: [...tableColumns, 'action'],
      };
    });
    this.state.connect('filteredTable', this.searchHandler$);
    this.searchTextSubject$;
  }

  ngOnInit(): void {
    this.search$.next(this.searchInput);
  }

  edit(item: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditPageComponent, {
      width: '60vw',
      height: '60vh',
      data: { ...item },
    });

    dialogRef.afterClosed().subscribe((updatedData) => {
      //   if (updatedData) {
      //     const index = this.periodic$.findIndex(
      //       (el) => el.position === item.position
      //     );
      //     if (index !== -1) {
      //       this.serverData[index] = updatedData;
      //       this.serverData = [...this.serverData];
      //       this.cdr.detectChanges();
      //     }
      //   }
    });
  }

  onSearch(): void {
    this.search$.next(this.searchInput);
  }

  onSearchTextChange(value: string): void {
    this.searchTextSubject$.next(value);
  }
}
