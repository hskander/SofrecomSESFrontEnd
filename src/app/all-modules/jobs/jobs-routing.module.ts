import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobsComponent } from './jobs.component';
import { ManageJobsComponent } from './manage-jobs/manage-jobs.component';

const routes: Routes = [
  {
    path:"",
    component:JobsComponent,
    children:[
      {
        path:"manage-jobs",
        component:ManageJobsComponent
      },
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
