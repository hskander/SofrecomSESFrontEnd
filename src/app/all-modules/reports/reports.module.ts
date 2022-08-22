import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
import { DataTablesModule } from 'angular-datatables';
import { SharingModule } from 'src/app/sharing/sharing.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ReportsComponent, ExpenseReportComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    SharingModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class ReportsModule { }
