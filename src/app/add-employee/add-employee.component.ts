import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/service/location.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatSnackBar } from '@angular/material/snack-bar'

declare const L: any;

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  latitude: any;

  longitude: any;

  mymap: any;

  marker: any;

  address: any;

  empForm: any;

  imagePath: string = '';

  previewUrl: any = '';

  spinner: boolean = false;

  constructor(
    private location: LocationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private af: AngularFireStorage,
    private db: AngularFireDatabase,
    private snackBar: MatSnackBar
  ) {
    this.empForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required]],
      designation: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.mymap = this.location.setView(this.latitude, this.longitude);
      this.mymap.on('click', (element) => {
        this.latitude = element.latlng.lat
        this.longitude = element.latlng.lng
        this.mymap.removeLayer(this.marker);
        this.getLocation();
      });
      this.getLocation();
    })
  }

  getLocation() {
    this.location.addTileLayer().addTo(this.mymap);
    this.marker = this.location.locationMarker(this.latitude, this.longitude).addTo(this.mymap);
    this.location.getAddress(this.latitude, this.longitude).subscribe((data: any) => {
        this.address = data.address;
    });
  }

  goToEmployeeList() {
    this.router.navigate(['empList']);
  }

  processImage(event) {
    this.imagePath = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }

  async uploadImage() {
    this.spinner = true;
    if (this.imagePath === '') {
      this.spinner = false;
      this.openSnackBar('Upload Image', '')
      return false;
    }
    let snap = await this.af.upload("/files" + Math.random() + this.imagePath, this.imagePath)
    this.getUrl(snap);
  }

  async getUrl(snap: any) {
    let url = ''
    url = await snap.ref.getDownloadURL();
    if (url !== '') {
      this.submitData(url)
    } else {
      this.openSnackBar('Failed to upload image', '');
    }
  }

  submitData(url) {
    let reqObj = {};
    this.spinner = true;
    reqObj['name'] = this.empForm.value.name;
    reqObj['email'] = this.empForm.value.email;
    reqObj['mobileNumber'] = this.empForm.value.mobileNumber;
    reqObj['designation'] = this.empForm.value.designation;
    reqObj['address'] = this.address;
    reqObj['latitude'] = this.latitude;
    reqObj['longitude'] = this.longitude;
    reqObj['url'] = url;
    this.db.list('/employee').push(reqObj).then((res) => {
      this.spinner = false;
      this.openSnackBar('Employee added successfully', '');
      this.router.navigate(['empList']);
    }, (err) => {
      this.spinner = false;
      this.openSnackBar('Failed to add employee', '');
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
