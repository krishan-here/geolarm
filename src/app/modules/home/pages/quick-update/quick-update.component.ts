import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Reminder } from 'src/app/core/interfaces/reminder';
import { ReminderService } from 'src/app/core/services/reminder.service';

@Component({
  selector: 'app-quick-update',
  templateUrl: './quick-update.component.html',
  styleUrls: ['./quick-update.component.scss'],
})
export class QuickUpdateComponent implements OnInit {

  @Input() reminderItemIdx;
  reminderItem: Reminder;
  reminderForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private reminderService: ReminderService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.reminderItem = this.reminderService.getReminderItem(this.reminderItemIdx);
    this.buildForm();
    this.initializeData(this.reminderItem);
  }

  buildForm(){
    this.reminderForm = this.formBuilder.group({
      address: [''],
      range: [''],
      currentRange: [''],
      label: [''],
      ringtone: [''],
      isTurnOn: [''],
      latitude: [''],
      longitude: ['']
    });
  }

  initializeData(reminderData: any){
    this.reminderForm.patchValue(reminderData);
  }

  saveReminder(){
    this.reminderService.updateReminder(this.reminderForm.value, this.reminderItemIdx);
    this.dismiss();
  }

  goToUpdate(){
    this.dismiss();
    this.router.navigateByUrl(`/home/update-reminder?itemIndex=${this.reminderItemIdx}`);
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
