import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AlertController, TextValueAccessor } from '@ionic/angular';
import { Router } from '@angular/router';
import { AgmMap, MapsAPILoader } from '@agm/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';


// declare const google;

@Component({
  selector: 'app-add-alarm',
  templateUrl: './add-alarm.component.html',
  styleUrls: ['./add-alarm.component.scss'],
})
export class AddAlarmComponent implements OnInit {
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  @ViewChild('search', {static: true}) searchElementRef: ElementRef;
  @ViewChild(AgmMap, {static: true}) public agmMap: AgmMap;

  // @ViewChild('map', {static: false}) mapElement: ElementRef;
  // @ViewChild('searchbar', {static: false}) searchbar: TextValueAccessor;
  map: any;
  address: string;
  latitude=0;
  longitude=0;
  autocomplete: any;
  zoom;
  geoCoder;


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    // this.loadMap();

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          console.log('hello');

          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.getAddress(this.latitude, this.longitude);
          console.log(this.latitude, this.longitude);
          this.agmMap.triggerResize();
          this.zoom = 25;
        });
      });
    });
  }

  goToHome(){
    this.router.navigateByUrl('home');
  }

  goToUpdate(){
    this.router.navigateByUrl(`/home/update-reminder?latitude=${this.latitude}&longitude=${this.longitude}&address=${this.address}`
    );
  }


  async showAlert(subheader, msg){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: subheader,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }


  // =======================

  // setCurrentLocation() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.latitude = position.coords.latitude;
  //       this.longitude = position.coords.longitude;
  //       console.log(this.latitude, this.longitude);

  //       this.zoom = 25;
  //       this.getAddress(this.latitude, this.longitude);
  //     });
  //   }
  // }

  setCurrentLocation() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      console.log('Plugin geolocation not available');
      return;
    }
    Geolocation.getCurrentPosition().then(data => {
      this.latitude = data.coords.latitude;
      this.longitude = data.coords.longitude;
      this.zoom = 25;
      this.getAddress(this.latitude, this.longitude);
    }).catch(err => {
      console.error(err);
    });
  }



  location(loc){
    this.latitude=loc.coords.lat;
    this.longitude=loc.coords.lng;
    console.log(this.longitude);
    this.getAddress(this.latitude, this.longitude);

  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }


}
