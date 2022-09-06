import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AllModulesService } from "../../all-modules.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import {Institut} from 'src/models/institut';
declare const $: any;
@Component({
  selector: "app-holidays",
  templateUrl: "./holidays.component.html",
  styleUrls: ["./holidays.component.css"],
})
export class HolidaysComponent implements OnInit, OnDestroy { 
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  lstHolidays: any[];
  url: any = "holidays";
  public tempId: any;
  public editId: any;

  public rows = [];
  public srch = [];
  public dtTrigger: Subject<any> = new Subject();
  public addHolidayForm: FormGroup;
  public editHolidayForm: FormGroup;
  public instituts: Institut[]=[];
  public institut: Institut= new $;
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
   
  ) {}

  ngOnInit() {
    this.loadholidays();

    this.addHolidayForm = this.formBuilder.group({
      Institut: ["", [Validators.required]],
      Adress: ["", [Validators.required]],
      Email: ["", [Validators.required]],
      NumTel: ["", [Validators.required]],
      Description: ["", [Validators.required]],
    });

    // Edit Contact Form Validation And Getting Values

    this.editHolidayForm = this.formBuilder.group({
      editInstitut: ["", [Validators.required]],
      editAdress: ["", [Validators.required]],
      editEmail: ["", [Validators.required]],
      editNumTel: ["", [Validators.required]],
      editDescription: ["", [Validators.required]],
    });
  }

  // Get Employee  Api Call
  loadholidays() {
    this.srvModuleService.get('Institut/all').subscribe((data) => {
      this.instituts = data;
      this.dtTrigger.next();
      this.rows = this.instituts;
      this.srch = [...this.rows];
    });
  }

  // Add holidays Modal Api Call

  addholidays() {
    if(this.addHolidayForm.invalid){
      this.markFormGroupTouched(this.addHolidayForm)
      return
    }
    if (this.addHolidayForm.valid) {
      this.institut.id=null;
      this.institut.institut=this.addHolidayForm.value.Institut;
      this.institut.adresse=this.addHolidayForm.value.Adress;
      this.institut.numTel=this.addHolidayForm.value.NumTel;
      this.institut.description=this.addHolidayForm.value.Description;
      this.institut.email=this.addHolidayForm.value.Email;

      console.log(this.institut);
      this.srvModuleService.add(this.institut,'Institut/add').subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.loadholidays();
        $("#add_holiday").modal("hide");
        this.addHolidayForm.reset();
        this.toastr.success("Institut added", "Success");
      });
      
    }
  }

 

  // Edit holidays Modal Api Call

  editHolidays() {
    if (this.editHolidayForm.valid) {
      this.institut.id= this.editId;
      this.institut.institut=this.editHolidayForm.value.editInstitut;
      this.institut.adresse=this.editHolidayForm.value.editAdress;
      this.institut.email=this.editHolidayForm.value.editEmail;
      this.institut.numTel=this.editHolidayForm.value.editNumTel;
      this.institut.description=this.editHolidayForm.value.editDescription;
   
      };
      this.srvModuleService.update(this.institut, 'Institut/update').subscribe((data1) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.loadholidays();
      });
      
      $("#edit_holiday").modal("hide");
      this.toastr.success("Institut Updated succesfully", "Success");
    }

  edit(value) {
    this.editId = value;
    const index = this.instituts.findIndex((item) => {
      return item.id === value;
    });
    let toSetValues = this.instituts[index];
    this.editHolidayForm.setValue({
      editInstitut: toSetValues.institut,
      editAdress: toSetValues.adresse,
      editEmail: toSetValues.email,
      editNumTel: toSetValues.numTel,
      editDescription: toSetValues.description,
    });
  }
  
  // Delete holidays Modal Api Call

  deleteHolidays() {
    this.srvModuleService.delete(this.tempId, 'Institut/delete').subscribe((data) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.loadholidays();
    });
    $("#delete_holiday").modal("hide");
      this.toastr.success("Holidays Deleted", "Success");
  }

  // To Get The holidays Edit Id And Set Values To Edit Modal Form

 

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
