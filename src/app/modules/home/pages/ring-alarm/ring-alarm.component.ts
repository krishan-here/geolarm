import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reminder } from 'src/app/core/interfaces/reminder';
import { ReminderService } from 'src/app/core/services/reminder.service';

@Component({
  selector: 'app-ring-alarm',
  templateUrl: './ring-alarm.component.html',
  styleUrls: ['./ring-alarm.component.scss'],
})
export class RingAlarmComponent implements OnInit {

  itemIndex;
  reminderItem: Reminder;
  alarmSound: HTMLAudioElement;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reminderService: ReminderService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params =>{
      this.itemIndex = params.itemIndex;
      this.reminderItem = this.reminderService.getReminderItem(this.itemIndex);
      this.playSound();
    });
  }

  playSound(){
    this.alarmSound = new Audio('assets/sounds/sound_'+ this.reminderItem.ringtone + '.mp3');
    this.alarmSound.play();
  }

  closeAlarm(){
    if(this.alarmSound){
      this.alarmSound.pause();
      this.alarmSound.currentTime = 0;
    }
    this.reminderItem.isTurnOn = false;
    this.reminderService.updateReminder(this.reminderItem, this.itemIndex);
    this.router.navigateByUrl('/home');
  }

}
