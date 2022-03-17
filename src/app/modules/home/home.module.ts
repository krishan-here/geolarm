import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HomePageRoutingModule } from './home-routing.module';
import { AddAlarmComponent } from './pages/add-alarm/add-alarm.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UpdateReminderComponent } from './pages/update-reminder/update-reminder.component';
import { AlarmSoundComponent } from './pages/alarm-sound/alarm-sound.component';
import { QuickUpdateComponent } from './pages/quick-update/quick-update.component';
import { RingAlarmComponent } from './pages/ring-alarm/ring-alarm.component';
import { LongPressModule } from 'ionic-long-press';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicModule.forRoot(),
    HomePageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LongPressModule,
    FontAwesomeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC3KDGUSdhTx2582S4FuwMVvw7zWhwojrI',
      libraries: ['places']
    })
  ],
  declarations: [
    HomeComponent,
    AddAlarmComponent,
    UpdateReminderComponent,
    AlarmSoundComponent,
    QuickUpdateComponent,
    RingAlarmComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomePageModule {}
