import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const L: any;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private http: HttpClient,
  ) { }

  addTileLayer() {
    return L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFndTE5OTMiLCJhIjoiY2tmczE1eWFrMDYycjJxbWpuZXF6MGxnYiJ9._JlFFO7iLRHb-sl8NXmQ1A', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'your.mapbox.access.token'
    })
  }

  setView(latitude, longitude) {
    return L.map('map').setView([latitude, longitude], 13)
  }

  locationMarker(latitude, longitude) {
    return L.marker([latitude, longitude]);
  }

  getAddress(latitude, longitude) {
    return this.http.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
  }
}
