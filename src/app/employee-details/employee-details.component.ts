import { Component, OnInit } from '@angular/core';
import { parse } from 'url';
import { Router } from '@angular/router';
import { LocationService } from 'src/service/location.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {

  employeeDetails: any;

  latitude: any;

  longitude: any;

  mymap: any;

  marker: any;

  address: any;

  constructor(
    private router: Router,
    private location: LocationService,
  ) { }

  ngOnInit(): void {
    if (history.state.data !== undefined) {
      this.employeeDetails = history.state.data;
      this.address = this.employeeDetails.address;
      this.latitude = this.employeeDetails.latitude;
      this.longitude = this.employeeDetails.longitude;
      this.mymap = this.location.setView(this.latitude, this.longitude);
      this.location.addTileLayer().addTo(this.mymap);
      this.location.locationMarker(this.latitude, this.longitude).addTo(this.mymap);
    }
  }

  goToEmployeeList() {
    this.router.navigate(['empList']);
  }

}
