import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './pages/account/account.component';

import { AddAlarmComponent } from './pages/add-alarm/add-alarm.component';
import { AlarmSoundComponent } from './pages/alarm-sound/alarm-sound.component';
import { HomeComponent } from './pages/home/home.component';
import { RingAlarmComponent } from './pages/ring-alarm/ring-alarm.component';
import { UpdateReminderComponent } from './pages/update-reminder/update-reminder.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'add-alarm',
    component: AddAlarmComponent,
  },
  {
    path: 'update-reminder',
    component: UpdateReminderComponent,
  },
  {
    path: 'alarms',
    component: AlarmSoundComponent,
  },
  {
    path: 'ring-alarm',
    component: RingAlarmComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
