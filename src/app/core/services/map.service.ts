import { Injectable } from '@angular/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation
  ) { }

  // ask for permission

  askToTurnOnGPS() {
    return new Promise((res, rej) => {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            // When GPS Turned ON call method to get Accurate location coordinates
            res(true);
          },
          error => {
              res(false);
            }
        );
    });
  };

  // Fetch Location using GeoLocation

  async getCurrentPosition(){
    this.geolocation.getCurrentPosition().then((res)=>{
      console.log('location------', res);
      return res;
    }).catch(err => err);

  }

  // open maps with window.open

  // openMapsWithLatitudeAndLongitude(
  //   currentLatitude: string,
  //   currentLongitude: string,
  //   destinationLatitude: string,
  //   destinationLongitude: string)
  //   {
  //   const googleMapUrl = 'https://www.google.com/maps/dir/?api=1';
  //   window.open(`${googleMapUrl}&
  // origin=${currentLatitude},${currentLongitude}&destination=${destinationLatitude},${destinationLongitude}`);
  // }


}
