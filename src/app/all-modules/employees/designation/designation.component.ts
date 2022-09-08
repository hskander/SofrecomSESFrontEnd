import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AllModulesService } from "../../all-modules.service";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import {Pole} from "src/models/Pole";
import { Direction } from 'src/models/direction';
import { HttpErrorResponse } from '@angular/common/http';
import { Employee } from 'src/models/employee';
declare const $: any;
@Component({
  selector: "app-designation",
  templateUrl: "./designation.component.html",
  styleUrls: ["./designation.component.css"],
})

export class DesignationComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  lstDesignation: any[];
  url: any = "designation";
  public tempId: any;
  public editId: any;

  public rows = [];
  public srch = [];
  public addDesignationForm: FormGroup;
  public editDesignationForm: FormGroup;
  public affectManagerForm: FormGroup;
  public poles: Pole[]=[];
  public pole: Pole= new $;
  public directions: Direction[]=[];
  public employees: Employee[]=[];
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
    this.LoadDesignation();
    this.getDirections();

     
      //console.log(this.directions)
    this.addDesignationForm = this.formBuilder.group({
      Pole: ["", [Validators.required]],
      Direction: ["", [Validators.required]],
      Description : ["", [Validators.required]]
    });

    this.editDesignationForm = this.formBuilder.group({
      editPole: ["", [Validators.required]],
      editDirection: ["", [Validators.required]],
      editDescription: ["", [Validators.required]],
      Manager: [""]
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
 
  // Get designation list  Api Call
  LoadDesignation() {
    this.srvModuleService.get('Pole/all').subscribe((data) => {
      this.poles = data;
      this.dtTrigger.next();
      this.rows = this.poles;
      this.srch = [...this.rows];
    });
  }

  getDirections(): void {
    this.srvModuleService.get('Direction/all').subscribe(
      (response: Direction[]) => {
        this.directions= response;
        //console.log(this.directions);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  // Add Designation  Modal Api Call
  addDesignation() {
    if(this.addDesignationForm.invalid){
      this.markFormGroupTouched(this.addDesignationForm)
      return
    }
    
    if (this.addDesignationForm.valid) {
        this.pole.id = null; 
        this.pole.pole =  this.addDesignationForm.value.Pole;
        this.pole.description =  this.addDesignationForm.value.Description;
        this.pole.direction= this.addDesignationForm.value.Direction ;

        console.log(this.pole);
      this.srvModuleService.add(this.pole,`Pole/addPole?directionId=${this.pole.direction.id}`).subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        $("#datatable").DataTable().clear();
        this.LoadDesignation();
        $("#add_designation").modal("hide");
        this.addDesignationForm.reset();
        this.toastr.success("Desigantion added sucessfully...!", "Success");
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
    const index = this.poles.findIndex((item) => {
      return item.id === this.editId;
    });
    let toSetValues = this.poles[index];
    this.pole.id=this.editId;
    this.pole.direction=toSetValues.direction;
    this.pole.description=toSetValues.description;
    this.pole.responsablePole=toSetValues.responsablePole;
    this.pole.employes=toSetValues.employes;

  }
  affectManager(){

    if (this.affectManagerForm.valid){
      this.srvModuleService.update(this.pole,`Pole/affecterManagerPole?poleId=${this.pole.id}&employeId=${this.affectManagerForm.value.Manager.id}`).subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        $("#datatable").DataTable().clear();
        this.LoadDesignation();
      });

      $("#affect_manager").modal("hide");
        this.toastr.success("Department Updated sucessfully...!", "Success");
    }
  }
  editDesignation() {
    if (this.editDesignationForm.valid) {
        this.pole.id = this.editId;
        this.pole.pole = this.editDesignationForm.value.editPole,
        this.pole.description = this.editDesignationForm.value.editDescription;
        this.pole.direction = this.editDesignationForm.value.editDirection;
        this.pole.manager=this.editDesignationForm.value.Manager
        this.srvModuleService.update(this.pole, 'Pole/editPole').subscribe((data1) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        $("#datatable").DataTable().clear();
        this.LoadDesignation();
        $("#edit_designation").modal("hide");
        this.toastr.success("Department Updated sucessfully...!", "Success");
      });
    }
  }

  // To Get The timesheet Edit Id And Set Values To Edit Modal Form
  edit(value) {
    this.editId = value;
    const index = this.poles.findIndex((item) => {
      return item.id === value;
    });
    let toSetValues = this.poles[index];
    this.editDesignationForm.setValue({
      editPole: toSetValues.pole,
      editDescription: toSetValues.description,
      editDirection: toSetValues.direction,
      Manager: toSetValues.manager,
    });
  }

  // Delete timedsheet Modal Api Call

  deleteDesignation() {
    this.srvModuleService.delete(this.tempId,'Pole/delete').subscribe((data) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      $("#datatable").DataTable().clear();
      this.LoadDesignation();
      $("#delete_designation").modal("hide");
      this.toastr.success("Designation deleted sucessfully..!", "Success");
    });
  }
  
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

 
searchPole(key) {
  this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      key = key.toLowerCase();
      return d.pole.toLowerCase().indexOf(key) !== -1
      || !key;
      
    });
    
    this.rows.push(...temp);

  }
}
