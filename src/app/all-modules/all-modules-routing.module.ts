import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AllModulesComponent } from "./all-modules.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "",
    component: AllModulesComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "employees",
        loadChildren: () =>
          import("./employees/employees.module").then((m) => m.EmployeesModule),
      },
      {
        path: "projects",
        loadChildren: () =>
          import("./projects/projects.module").then((m) => m.ProjectsModule),
      },
      {
        path: "leads",
        loadChildren: () =>
          import("./leads/leads.module").then((m) => m.LeadsModule),
      },
      {
        path: "reports",
        loadChildren: () =>
          import("./reports/reports.module").then((m) => m.ReportsModule),
      },
      {
        path: "goals",
        loadChildren: () =>
          import("./goals/goals.module").then((m) => m.GoalsModule),
      },
      {
        path: "training",
        loadChildren: () =>
          import("./training/training.module").then((m) => m.TrainingModule),
      },
      {
        path: "assets",
        loadChildren: () =>
          import("./assets/assets.module").then((m) => m.AssetsModule),
      },
      {
        path: "jobs",
        loadChildren: () =>
          import("./jobs/jobs.module").then((m) => m.JobsModule),
      },
      {
        path: "settings",
        loadChildren: () =>
          import("./settings/settings.module").then((m) => m.SettingsModule),
      },
      {
        path: "dailyreports",
        loadChildren: () =>
          import("./dailyreports/dailyreports.module").then(
            (m) => m.DailyreportsModule
          ),
      },
      {
        path: "jobsdashboard",
        loadChildren: () =>
          import("./jobsdashboard/jobsdashboard.module").then(
            (m) => m.JobsdashboardModule
          ),
      },
      {
        path: "experience",
        loadChildren: () =>
          import("./experience/experience.module").then(
            (m) => m.ExperienceModule
          ),
      },
      {
        path: "useralljobs",
        loadChildren: () =>
          import("./useralljobs/useralljobs.module").then(
            (m) => m.UseralljobsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllModulesRoutingModule {}
