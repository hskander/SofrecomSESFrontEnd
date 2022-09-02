import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AllModulesService } from "../../all-modules.service";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { Direction } from 'src/models/direction';
import { HttpErrorResponse } from '@angular/common/http';
import { Employee } from 'src/models/employee';
declare const $: any;
@Component({
  selector: "app-departments",
  templateUrl: "./departments.component.html",
  styleUrls: ["./departments.component.css"],
})
export class DepartmentsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  public lstDepartment: any[];
  public url: any = "departments";
  public tempId: any;
  public editId: any;
  public rows:any[] = [];
  public srch:any[] = [];
  public addDepartmentForm: FormGroup;
  public editDepartmentForm: FormGroup;
  public affectManagerForm: FormGroup;
  public directions: Direction[]=[];
  public manager:Employee= new $;
  public employees:Employee[]=[];
  public direction: Direction= new $;
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    //private chRef : ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
    
    this.LoadDepartment();

    this.addDepartmentForm = this.formBuilder.group({
      Direction: ["", [Validators.required]],
      ResponsableDir: ["", [Validators.required]],
      Description: ["", [Validators.required]],
    });

    this.editDepartmentForm = this.formBuilder.group({
      Direction: ["", [Validators.required]],
      ResponsableDir: ["", [Validators.required]],
      Description: ["", [Validators.required]],
    });
    this.affectManagerForm=this.formBuilder.group({
      Manager: ["", [Validators.required]]
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Get department list  Api Call
  LoadDepartment() {
    this.srvModuleService.get('Direction/all').subscribe((data) => {
      $("#datatable").DataTable().clear();
      this.directions = data;
      //this.chRef.detectChanges();
      this.dtTrigger.next();
      this.rows = this.directions;
      this.srch = [...this.rows];
    });
  }

  // Add Department  Modal Api Call
  addDepartment() {
    
    if(this.addDepartmentForm.invalid){
      this.markFormGroupTouched(this.addDepartmentForm)
      return
    }
    if (this.addDepartmentForm.valid) {
      this.direction.id=null;
      this.direction.direction=this.addDepartmentForm.value.Direction;
      this.direction.description=this.addDepartmentForm.value.Description;
      this.direction.responsableDirection=this.addDepartmentForm.value.ResponsableDir;
      console.log(this.direction);
      this.srvModuleService.add(this.direction,'Direction/addDirection').subscribe((data) => {
        $("#datatable").DataTable().clear();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.LoadDepartment();
      $("#add_department").modal("hide");
      this.addDepartmentForm.reset();
      this.toastr.success("Direction added sucessfully...!", "Success");
      });
    }
  }
  onAffectManagerButton(value){
    this.srvModuleService.get('Employee/allEmployees').subscribe(
      (response: Employee[]) =>{
        this.employees=response;
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    );
    this.editId = value;
    const index = this.directions.findIndex((item) => {
      return item.id === this.editId;
    });
    let toSetValues = this.directions[index];
    this.direction.id=this.editId;
    this.direction.direction=toSetValues.direction;
    this.direction.description=toSetValues.description;
    this.direction.responsableDirection=toSetValues.responsableDirection;
    this.direction.poles=toSetValues.poles;

  }
  affectManager(){
    if (this.affectManagerForm.valid){
      this.srvModuleService.update(this.direction,`Direction/affecterManagerDirection?directionId=${this.direction.id}&employeId=${this.affectManagerForm.value.Manager.id}`).subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.LoadDepartment();
        
      });
      $("#affect_manager").modal("hide");
        this.toastr.success("Department Updated sucessfully...!", "Success");
    }
   
  }

  editDepartment() {
    if (this.editDepartmentForm.valid) {
        this.direction.id= this.editId;
        this.direction.direction=this.editDepartmentForm.value.Direction;
        this.direction.description=this.editDepartmentForm.value.Description;
        this.direction.responsableDirection=this.editDepartmentForm.value.ResponsableDir;
     
      this.srvModuleService.update(this.direction, 'Direction/editDirection').subscribe((data1) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        $("#datatable").DataTable().clear();
        this.LoadDepartment();
        $("#edit_department").modal("hide");
        this.toastr.success("Department Updated sucessfully...!", "Success");
      });
     
    }

  }

  // To Get The department Edit Id And Set Values To Edit Modal Form
  edit(value) {
    this.editId = value;
    const index = this.directions.findIndex((item) => {
      return item.id === value;
    });
    let toSetValues = this.directions[index];
    this.editDepartmentForm.setValue({
      Direction: toSetValues.direction,
      ResponsableDir: toSetValues.responsableDirection,
      Description: toSetValues.description
    });
  }

  deleteDepartment() {
    this.srvModuleService.delete(this.tempId, 'Direction/deleteDirection').subscribe((data) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      $("#datatable").DataTable().clear();
      this.LoadDepartment();
      $("#delete_department").modal("hide");
      this.toastr.success("Department deleted sucessfully..!", "Success");
    });
  }
  
  searchDirection(key) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      key = key.toLowerCase();
      return d.direction.toLowerCase().indexOf(key) !== -1 
      || d.description.toLowerCase().indexOf(key) !== -1
      || d.responsableDirection.toLowerCase().indexOf(key) !== -1 
      || !key;
    });
    this.rows.push(...temp);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
