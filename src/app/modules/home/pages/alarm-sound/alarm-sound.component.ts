import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReminderService } from 'src/app/core/services/reminder.service';

@Component({
  selector: 'app-alarm-sound',
  templateUrl: './alarm-sound.component.html',
  styleUrls: ['./alarm-sound.component.scss'],
})
export class AlarmSoundComponent implements OnInit, OnDestroy {
  soundArr = [];
  alarmSound: HTMLAudioElement;
  selectedIndex;
  constructor(
    private router: Router,
    private reminderService: ReminderService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.soundArr = this.reminderService.getAllSound();
    this.route.queryParams.subscribe(params =>{
      this.selectedIndex = params.ringtone;
      console.log(this.selectedIndex);
    });
  }

  playSound(index){
    this.selectedIndex = index;
    if(this.alarmSound){
      this.alarmSound.pause();
      this.alarmSound.currentTime = 0;
    }
    this.alarmSound = new Audio('assets/sounds/sound_'+ index + '.mp3');
    this.alarmSound.play();
  }

  goBack(){
    if(this.selectedIndex){
      this.router.navigateByUrl(`/home/update-reminder?ringtone=${this.selectedIndex}`);
    }
  }

  ngOnDestroy(): void {
    if(this.alarmSound){
      this.alarmSound.pause();
      this.alarmSound.currentTime = 0;
    }
  }

}
