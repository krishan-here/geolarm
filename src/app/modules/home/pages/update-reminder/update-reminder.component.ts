import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReminderService } from 'src/app/core/services/reminder.service';

@Component({
  selector: 'app-update-reminder',
  templateUrl: './update-reminder.component.html',
  styleUrls: ['./update-reminder.component.scss'],
})
export class UpdateReminderComponent implements OnInit {

  reminderForm: FormGroup;
  soundArr=[];

  //for updating reminder
  isUpdate= false;
  reminderItemIndex;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private reminderService: ReminderService
  ) { }

  ngOnInit() {
    this.soundArr = this.reminderService.getAllSound();
    this.route.queryParams.subscribe(params =>{
      if(!this.reminderForm){
        this.buildForm();
      }
      if(params.itemIndex){
        this.reminderItemIndex = params.itemIndex;
        const reminderItem = this.reminderService.getReminderItem(params.itemIndex);
        this.initializeData(reminderItem);
        this.isUpdate = true;
      }
      else{
        this.initializeData(params);
      }
    });
  }

  buildForm(){
    this.reminderForm = this.formBuilder.group({
      address: ['', [Validators.required]],
      range: [, [Validators.required]],
      currentRange: [],
      label: [''],
      ringtone: [1],
      isTurnOn: [true],
      latitude: [0],
      longitude: [0]
    });
  }

  initializeData(reminderData: any){
    this.reminderForm.patchValue(reminderData);
  }

  addReminder(){
    if(this.reminderForm.invalid){
      this.reminderForm.markAllAsTouched();
      return;
    }
    if(this.isUpdate){
      this.reminderService.updateReminder(this.reminderForm.value, this.reminderItemIndex);
    }else{
      this.reminderService.addReminder(this.reminderForm.value);
    }
    this.goToHome();
  }

  goToHome(){
    this.reminderForm= undefined;
    this.isUpdate=false;
    this.router.navigateByUrl('home');
  }

  goToAlarm(){
    this.router.navigateByUrl(`/home/alarms?ringtone=${this.reminderForm.value.ringtone}`);
  }

}
