import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BatchTransformPicsComponent } from './batch_transform_pics.component';

const routes: Routes = [
  { path: '', component: BatchTransformPicsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchTransformPicsRoutingModule { }
