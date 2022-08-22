import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoalsComponent } from './goals.component';
import { GoalListComponent } from './goal-list/goal-list.component';
const routes: Routes = [
  {
    path:"",
    component:GoalsComponent,
    children:[
      {
        path:"goallist",
        component:GoalListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoalsRoutingModule { }
