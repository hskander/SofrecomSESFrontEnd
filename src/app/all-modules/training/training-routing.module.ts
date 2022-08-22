import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrainingComponent } from './training.component';
import { TrainingListComponent } from './training-list/training-list.component';
const routes: Routes = [
  {
    path:"",
    component:TrainingComponent,
    children:[
      {
        path:"traininglist",
        component:TrainingListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
