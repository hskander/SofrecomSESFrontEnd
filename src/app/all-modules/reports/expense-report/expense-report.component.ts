import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { AllModulesService } from "../../all-modules.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { CentreFormation } from "src/models/centreformation";

declare const $: any;
@Component({
  selector: "app-expense-report",
  templateUrl: "./expense-report.component.html",
  styleUrls: ["./expense-report.component.css"],
})
export class ExpenseReportComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public url: any = "expenseReport";
  public allExpensesReport: any = [];
  public tempId: any;
  public editId: any;
  public rows :any = [];
  public srch :any = [];
  public dtTrigger: Subject<any> = new Subject();
  public addExpensereportForm: FormGroup;
  public editExpensereportForm: FormGroup;
  public centresformation: CentreFormation[]=[];
  public centreformation: CentreFormation= new $;
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
   
  ) {}
 

  ngOnInit() {
    
      this.loadexpenseReport();
      this.addExpensereportForm = this.formBuilder.group({
        CentreFormation: ["", [Validators.required]],
        Description: ["", [Validators.required]],
        Adress: ["", [Validators.required]],
        Email: ["", [Validators.required]],
        NumTel: ["", [Validators.required]],
       
      });

      this.editExpensereportForm = this.formBuilder.group({
        editCentreFormation: ["", [Validators.required]],
        editDescription: ["", [Validators.required]],
        editAdress: ["", [Validators.required]],
        editEmail: ["", [Validators.required]],
        editNumTel: ["", [Validators.required]],
        
      });
    }

    loadexpenseReport() {
      this.srvModuleService.get('CentreFormation/all').subscribe((data) => {
        this.centresformation = data;
        this.dtTrigger.next();
        this.rows = this.centresformation;
        this.srch = [...this.rows];
      });
    }


    addExpenseReport() {
      if(this.addExpensereportForm.invalid){
        this.markFormGroupTouched(this.addExpensereportForm)
        return
      }
      if (this.addExpensereportForm.valid) {
        this.centreformation.id=null;
        this.centreformation.centreFormationName=this.addExpensereportForm.value.CentreFormation;
        this.centreformation.description=this.addExpensereportForm.value.Description;
        this.centreformation.adresse=this.addExpensereportForm.value.Adress;
        this.centreformation.numTel=this.addExpensereportForm.value.NumTel;
        this.centreformation.email=this.addExpensereportForm.value.Email;
  
        console.log(this.centreformation);
        this.srvModuleService.add(this.centreformation,'CentreFormation/add').subscribe((data) => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
          });
          this.loadexpenseReport();
          $("#add_Center").modal("hide");
          this.addExpensereportForm.reset();
          this.toastr.success("Institut added", "Success");
        });
        
      }
    }

    editExpenseReport() {
      if (this.editExpensereportForm.valid) {
        this.centreformation.id= this.editId;
        this.centreformation.centreFormationName=this.editExpensereportForm.value.editCentreFormation;
        this.centreformation.description=this.editExpensereportForm.value.editDescription;
        this.centreformation.adresse=this.editExpensereportForm.value.editAdress;
        this.centreformation.email=this.editExpensereportForm.value.editEmail;
        this.centreformation.numTel=this.editExpensereportForm.value.editNumTel;
       
     
        };
        this.srvModuleService.update(this.centreformation, 'CentreFormation/update').subscribe((data1) => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
          });
          this.loadexpenseReport();
        });
        
        $("#edit_expenseReport").modal("hide");
        this.toastr.success("Centre Formation Updated succesfully", "Success");
      }
      edit(value) {
        this.editId = value;
        const index = this.centresformation.findIndex((item) => {
          return item.id === value;
        });
        let toSetValues = this.centresformation[index];
        this.editExpensereportForm.setValue({
          editCentreFormation: toSetValues.centreFormationName,
          editAdress: toSetValues.adresse,
          editEmail: toSetValues.email,
          editNumTel: toSetValues.numTel,
          editDescription: toSetValues.description,
        });
      }

      deleteexpensereport() {
        this.srvModuleService.delete(this.tempId, 'CentreFormation/delete').subscribe((data) => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
          });
          this.loadexpenseReport();
        });
        $("#delete_expenseReport").modal("hide");
          this.toastr.success("Centre Formation Deleted", "Success");
      }


      private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control) => {
          control.markAsTouched();
          if (control.controls) {
            this.markFormGroupTouched(control);
          }
        });
      }
      ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();

} 

}
