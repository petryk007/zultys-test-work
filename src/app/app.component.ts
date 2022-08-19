import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs/internal/Observable';
import {map, startWith} from 'rxjs/operators';
import { SubSink } from 'subsink';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { HttpService } from './http.service';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AppComponent implements OnInit {
  search = new FormControl('');
  options: any = [];
  filteredOptions: Observable<string[]>;
  hiddenBlock = true;
  displayedColumns = ['name', 'country', 'code', 'site'];
  private readonly subs = new SubSink();
  dataForTable = new MatTableDataSource();
  selectedRowIndex:any;
  theme = false;
  slideName = 'White';

  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private httpService: HttpService
  ) {
    this.getCountry();
    this.setTheme(this.theme)
  }

  ngOnInit(): void {
    this.filteredOptions = this.search.valueChanges.pipe(
      startWith(''),
      map(value => this.options.filter(option => option.toLowerCase().includes(value.toLowerCase()))),
    )
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  getCountry() {
    this.subs.add(
      this.httpService.getCountry().subscribe(res => {
        if (res) {
          this.options = res;
        }
      })
    );
  }

  clickSearch() {
    const country = this.search.value;
    this.subs.add(
      this.httpService.getUniversitiByCountry(country).subscribe((resp: any) => {
        this.dataForTable = new MatTableDataSource(resp);
        this.dataForTable.paginator = this.paginator;
        this.dataForTable.sort = this.sort;
        this.hiddenBlock = false;
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataForTable.filter = filterValue.trim().toLowerCase();

    if (this.dataForTable.paginator) {
      this.dataForTable.paginator.firstPage();
    }
  }

  tableDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  changeTheme(event) {
    this.slideName = event.checked ? 'Black' : 'White';
    this.setTheme(event.checked);
  }

  selectRow(index, row) {
    this.selectedRowIndex = index;
    this.expandedElement = this.expandedElement === row ? null : row
  }

  private setTheme(darkTheme: boolean) {
    const lightClass = 'theme--light';
    const darkClass = 'theme--dark';
    const removeClass = darkTheme ? lightClass : darkClass;
    const addClass = darkTheme ? darkClass : lightClass;
    document.body.classList.remove(removeClass);
    document.body.classList.add(addClass);
  }
}
