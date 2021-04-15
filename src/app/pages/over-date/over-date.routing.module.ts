import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverDateComponent } from './over-date.component';

const routes: Routes = [
  { path: '', component: OverDateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverDateRoutingModule { }
