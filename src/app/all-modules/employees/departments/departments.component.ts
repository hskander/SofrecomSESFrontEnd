import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AllModulesService } from "../../all-modules.service";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { DirectionService } from 'src/services/direction.service';
import { Direction } from 'src/models/direction';
import { HttpErrorResponse } from '@angular/common/http';
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
  public rows = [];
  public srch = [];
  public addDepartmentForm: FormGroup;
  public editDepartmentForm: FormGroup;
  public directions: Direction[]=[];
  public direction: Direction= new $;
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private directionService:DirectionService,
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
      DepartmentName: ["", [Validators.required]],
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
    /*this.srvModuleService.get(this.url).subscribe((data) => {
      this.lstDepartment = data;
      this.dtTrigger.next();
      this.rows = this.lstDepartment;
      this.srch = [...this.rows];
    });*/
    this.directionService.getDirections().subscribe(
      (response: Direction[]) =>{
        this.directions=response;
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    );
  }

  // Add Department  Modal Api Call
  addDepartment() {
    
    if(this.addDepartmentForm.invalid){
      this.markFormGroupTouched(this.addDepartmentForm)
      return
    }
    if (this.addDepartmentForm.valid) {
      let obj:Direction = {
        id:null,
        direction: this.addDepartmentForm.value.Direction,
        description:this.addDepartmentForm.value.Description,
        responsableDirection: this.addDepartmentForm.value.ResponsableDir,
        manager: null,
        poles:[]
      };
      console.log(obj);
      this.srvModuleService.add(obj,'Direction/addDirection').subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        
      });
      this.LoadDepartment();
      $("#add_department").modal("hide");
      this.addDepartmentForm.reset();
      this.toastr.success("Direction added sucessfully...!", "Success");
    }
  }
  addDirection(){
    this.direction.direction=this.addDepartmentForm.value.Direction;
      this.direction.description=this.addDepartmentForm.value.Description;
      this.direction.responsableDirection=this.addDepartmentForm.value.ResponsableDir;
    this.directionService.add(this.direction).subscribe(
      (response: Direction) => {
        console.log(response);
        this.LoadDepartment();
        $("#add_department").modal("hide");
      this.addDepartmentForm.reset();
      this.toastr.success("Direction added sucessfully...!", "Success");
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    );
    
  }

  editDepartment() {
    if (this.editDepartmentForm.valid) {
      let obj = {
        departmentName: this.editDepartmentForm.value.DepartmentName,
        id: this.editId,
      };
      this.srvModuleService.update(obj, this.url).subscribe((data1) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      });
      this.LoadDepartment();
      $("#edit_department").modal("hide");
      this.toastr.success("Department Updated sucessfully...!", "Success");
    }
  }

  // To Get The department Edit Id And Set Values To Edit Modal Form
  edit(value) {
    this.editId = value;
    const index = this.lstDepartment.findIndex((item) => {
      return item.id === value;
    });
    let toSetValues = this.lstDepartment[index];
    this.editDepartmentForm.setValue({
      DepartmentName: toSetValues.departmentName,
    });
  }


  deleteDepartment() {
    this.srvModuleService.delete(this.tempId, 'Direction/deleteDirection').subscribe((data) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.LoadDepartment();
      $("#delete_department").modal("hide");
      this.toastr.success("Department deleted sucessfully..!", "Success");
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
