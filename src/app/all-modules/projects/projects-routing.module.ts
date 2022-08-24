import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectContentComponent } from './project-content/project-content.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectViewComponent } from './project-view/project-view.component';

const routes: Routes = [
  {
    path: "",
    component: ProjectsComponent,
    children: [
      {
        path: "projectpage",
        component: ProjectContentComponent
      },
      {
        path: "projectlist",
        component: ProjectListComponent
      },
      {
        path: "projectview/:id",
        component: ProjectViewComponent
      }



    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
