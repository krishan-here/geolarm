import { Injectable } from '@angular/core';
import { Reminder } from '../interfaces/reminder';

@Injectable({
  providedIn: 'root'
})
export class ReminderService{

  reminderList: Reminder[]=[];
  soundList= ['Relax', 'Flute', 'Morning', 'Fresh', 'Love', 'Jolly'];
  constructor(){}

  getAllReminderList(){
    this.reminderList = JSON.parse(localStorage.getItem('reminderList')) || [];
    return this.reminderList;
  }

  getAllSound(){
    return this.soundList;
  }

  addReminder(reminderItem: Reminder){
    console.log(this.reminderList);

    this.reminderList.push(reminderItem);
    this.storeReminderList();
  }

  getReminderItem(index){
    return this.reminderList[index];
  }

  updateReminder(reminderItem: Reminder, itemIndex: number){
    this.reminderList[itemIndex] = reminderItem;
    this.storeReminderList();
  }

  storeReminderList(){
    localStorage.setItem('reminderList', JSON.stringify(this.reminderList));
  }

  deleteItems(deleteItems: any[]){
    this.reminderList = this.reminderList.filter((item, idx)=> !deleteItems[idx]);
    this.storeReminderList();
  }

}
