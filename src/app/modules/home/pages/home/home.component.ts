import { Component, ElementRef, NgZone, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Gesture, GestureController, ModalController, TextValueAccessor } from '@ionic/angular';
import { Reminder } from 'src/app/core/interfaces/reminder';
import { ReminderService } from 'src/app/core/services/reminder.service';
import { QuickUpdateComponent } from '../quick-update/quick-update.component';
import { Geolocation } from '@capacitor/geolocation';
import { Contacts } from '@capacitor-community/contacts';
import { faD, faTrash } from '@fortawesome/free-solid-svg-icons';
import appConstants from 'src/app/core/utils/app.constants';
import { Contact } from 'src/app/core/interfaces/contact';

declare const google;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  @ViewChild('searchbar', {static: false}) searchbar: TextValueAccessor;
  alarmTab = appConstants.homeTabs.alarm;
  contactTab = appConstants.homeTabs.contact;
  currentTab= this.alarmTab;
  currentLocation: {lat: number; long: number} = {lat: 0, long: 0};
  watchId;
  alarmSound: HTMLAudioElement;
  reminderList: Reminder[]=[];

  // delete section
  showRadiobtn = false;
  deleteItemArray= [];
  seletedItemCount = 0;
  faDelete = faTrash;

  // contacts
  contacts: Contact[]=[];


  constructor(
    private router: Router,
    private reminderService: ReminderService,
    private modalController: ModalController,
    private zone: NgZone,
  ) {}

  async ngOnInit(){
    await this.requestPermissions();
    this.getContacts();
    this.getAllReminder();
  }

  async ionViewDidEnter(){
    await this.clearWatch();
    this.watchPosition();
  }

  getContacts(){
      Contacts.getContacts().then(result => {
        this.contacts = result.contacts;
        this.contacts.sort((x, y)=> x.displayName.localeCompare(y.displayName));
    });
  }

  segmentChanged(event){
    console.log(this.currentTab);
  }

  showDeleteView(itemIndex){
    navigator.vibrate(30);
    this.showRadiobtn= true;
    this.seletedItemCount=1;
    this.deleteItemArray = Array.from({length: this.reminderList.length}, ()=> false);
    this.deleteItemArray[itemIndex] = true;
    console.log(this.deleteItemArray);
  }

  deleteItemSelected(){
    return this.deleteItemArray.filter(item => item === true).length;
  }

  selectAllItem(){
    this.deleteItemArray = this.deleteItemArray.map(()=> true);
  }

  cancelDelete(){
    this.showRadiobtn = false;
    this.seletedItemCount = 0;
  }

  addItemToDelete(itemIndex, event?: any){
    if(!this.showRadiobtn){
      return;
    }
    if(event){
      this.deleteItemArray[itemIndex] = event.detail.checked;
    }else{
      this.deleteItemArray[itemIndex] = !this.deleteItemArray[itemIndex];
    }


    if(this.deleteItemArray[itemIndex]){
      this.seletedItemCount++;
    }else{
      this.seletedItemCount--;
    }
    return;
  }

  deleteItems(){
    this.reminderService.deleteItems(this.deleteItemArray);
    this.getAllReminder();
    this.showRadiobtn = false;
  }

  getAllReminder(){
    this.reminderList = this.reminderService.getAllReminderList();
  }

  async goToMap(){
    await this.clearWatch();
    this.router.navigate(['/home', 'add-alarm']);
  }

  async requestPermissions() {
    const permResult = await Geolocation.requestPermissions();
    const contactResult = await Contacts.getPermissions();

  }

  watchPosition() {

    try {
      this.watchId = Geolocation.watchPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }, (position, err) => {
        this.zone.run(() => {
          this.currentLocation.lat = position.coords.latitude;
          this.currentLocation.long = position.coords.longitude;
          this.calculateDistance();
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  async clearWatch() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: await this.watchId });
      this.watchId = undefined;
    }
  }

  calculateDistance(){
    const currentLat = this.currentLocation.lat/57.29577951;
    const currentLong = this.currentLocation.long/57.29577951;

    this.reminderList.forEach((reminderItem, itemIndex)=>{

      if(reminderItem.isTurnOn){
        const destinationLat = reminderItem.latitude/57.29577951;
        const destinationLong = reminderItem.longitude/57.29577951;

        // Haversine formula
        const dlon = destinationLong - currentLong;
        const dlat = destinationLat - currentLat;
        const a = Math.pow(Math.sin(dlat / 2), 2)
                + Math.cos(currentLat) * Math.cos(destinationLat)
                * Math.pow(Math.sin(dlon / 2),2);
        const c = 2 * Math.asin(Math.sqrt(a));

        // Radius of earth in kilometers
        const r = 6371;

        // calculate the distance in meter
        const currentRange = c * r * 1000;

        this.reminderList[itemIndex].currentRange = Math.round(currentRange);


        //check for alarm
        if(currentRange <= reminderItem.range){
          this.router.navigateByUrl(`/home/ring-alarm?itemIndex=${itemIndex}`);
        }
      }
    });
  }

  toggleReminder(event, index){
    const reminderItem = this.reminderList[index];
    reminderItem.isTurnOn = event.detail.checked;
    this.reminderService.updateReminder(reminderItem, index);
    this.getAllReminder();
  }

  async presentModal(reminderItemIdx) {
    if(this.showRadiobtn){
      return;
    }
    const modal = await this.modalController.create({
      component: QuickUpdateComponent,
      swipeToClose: true,
      backdropDismiss: true,
      cssClass: 'quick_update_modal',
      componentProps: {reminderItemIdx}
    });
    return await modal.present();
  }


}
