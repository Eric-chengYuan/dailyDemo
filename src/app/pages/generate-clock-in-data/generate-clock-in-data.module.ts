import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { SharedModule } from 'src/app/shared.module';
import { GenerateClockInDataComponent } from './generate-clock-in-data.component';
import { GenerateClockInDataRoutingModule } from './generate-clock-in-data.routing';

@NgModule({
  imports: [
    GenerateClockInDataRoutingModule,
    NzTimePickerModule,
    NzDatePickerModule,
    NzCardModule,
    CommonModule,
    NzCardModule,
    FormsModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    GenerateClockInDataComponent
  ],
  exports: []
})
export class GenerateClockInDataModule { }
