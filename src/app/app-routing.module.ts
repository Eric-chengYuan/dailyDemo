import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/' },
  { path: 'batchTransformPics', loadChildren: () => 
  import('./pages/batch_transform_pics/batch_transform_pics.module').then(m => m.BatchTransformPicsModule) },
  { path: 'overDate', loadChildren: () => import('./pages/over-Date/over-Date.module').then(m => m.OverDateModule) },
  { path: 'generateClock', loadChildren: () => import('./pages/generate-clock-in-data/generate-clock-in-data.module').then(
    m => m.GenerateClockInDataModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
