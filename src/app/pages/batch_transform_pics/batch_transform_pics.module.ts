import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { BatchTransformPicsComponent } from './batch_transform_pics.component';
import { BatchTransformPicsRoutingModule } from './batch_transform_pics.routing.module';

@NgModule({
  imports: [
    BatchTransformPicsRoutingModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    BatchTransformPicsComponent
  ],
  exports: []
})
export class BatchTransformPicsModule { }
