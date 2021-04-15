import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SharedModule } from 'src/app/shared.module';
import { OverDateComponent } from './over-date.component';
import { OverDateRoutingModule } from './over-date.routing.module';

@NgModule({
  imports: [
    OverDateRoutingModule,
    FormsModule,
    NzGridModule,
    NzModalModule,
    NzTableModule,
    SharedModule
  ],
  declarations: [
    OverDateComponent
  ],
  exports: []
})
export class OverDateModule { }
