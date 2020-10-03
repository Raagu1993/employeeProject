import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { fromEvent, Observable, Subscription } from "rxjs";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  empDatasource: any = [];

  displayedColumns: string[] = ['name', 'email', 'mobileNumber', 'designation'];

  resizeObservable$: Observable<Event>;

  resizeSubscription$: Subscription

  constructor(
    private router: Router,
    private db: AngularFireDatabase
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.db.object('/').valueChanges().subscribe((data) => {
      console.log(Object.values(Object.values(data)[0]))
      this.empDatasource = new MatTableDataSource(Object.values(Object.values(data)[0]));
      this.empDatasource.paginator = this.paginator;
    });
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe(event => {
      const w = event.target as Window;
      if (w.innerWidth > 600) {
        this.displayedColumns = ['name', 'email', 'mobileNumber', 'designation'];
      } else {
        this.displayedColumns = ['name', 'designation'];
      }
    })
  }
  
  addEmployee() {
    this.router.navigate(['addEmp'])
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.empDatasource.filter = filterValue.trim().toLowerCase();
    if (this.empDatasource.paginator) {
      this.empDatasource.paginator.firstPage();
    }
  }

  employeeDetail(item) {
    this.router.navigate(['empDetails'], { state: { data: item } })
    console.log(item)
  }

}
