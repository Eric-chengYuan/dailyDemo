import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateClockInDataComponent } from './generate-clock-in-data.component';

const routes: Routes = [
  { path: '', component: GenerateClockInDataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateClockInDataRoutingModule { }
