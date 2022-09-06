import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AllModulesService } from "../../all-modules.service";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import {Entreprise} from 'src/models/Entreprise';
import { DatePipe } from "@angular/common";
import { DataTableDirective } from "angular-datatables";
declare const $: any;
@Component({
  selector: "app-leaves-admin",
  templateUrl: "./leaves-admin.component.html",
  styleUrls: ["./leaves-admin.component.css"],
})
export class LeavesAdminComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public lstLeave: any[];
  public entreprise: Entreprise= new $;
  public entreprises:Entreprise[]=[];
  public url: any = "adminleaves";
  public tempId: any;
  public editId: any;
  public rows = [];
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public addLeaveadminForm: FormGroup;
  public editLeaveadminForm: FormGroup;
  public editFromDate: any;
  public editToDate: any;
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    

    this.loadLeaves();

    this.addLeaveadminForm = this.formBuilder.group({
      Entreprise: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      Email: ["", [Validators.required]],
      Phone: ["", [Validators.required]],
      Adress:["", [Validators.required]],
    });

    // Edit leaveadmin Form Validation And Getting Values

    this.editLeaveadminForm = this.formBuilder.group({
      Entreprise: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      Email: ["", [Validators.required]],
      Phone: ["", [Validators.required]],
      Adress:["", [Validators.required]],
    });

    // for data table configuration
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000);
  }

  // manually rendering Data table

  rerender(): void {
    $("#datatable").DataTable().clear();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.lstLeave = [];
    this.loadLeaves();
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000);
  }
  // Get leave  Api Call
  loadLeaves() {
    this.srvModuleService.get('Entreprise/all').subscribe((data) => {
      this.entreprises = data;
      this.rows = this.entreprises;
      this.srch = [...this.rows];
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
  // Add leaves for admin Modal Api Call
  addleaves() {
    if(this.addLeaveadminForm.invalid){
      this.markFormGroupTouched(this.addLeaveadminForm)
      return
    }
    if (this.addLeaveadminForm.valid) {
        this.entreprise.id=null;
        this.entreprise.entreprise = this.addLeaveadminForm.value.Entreprise, 
        this.entreprise.description= this.addLeaveadminForm.value.Description,
        this.entreprise.adresse=this.addLeaveadminForm.value.Adress,
        this.entreprise.email=this.addLeaveadminForm.value.Email,
        this.entreprise.numTel=this.addLeaveadminForm.value.Phone,
        console.log(this.entreprise);
      this.srvModuleService.add(this.entreprise,'Entreprise/add').subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.loadLeaves();
      });
      
      $("#add_leave").modal("hide");
      this.addLeaveadminForm.reset();
      this.toastr.success("Entreprise added sucessfully...!", "Success");
    }
  }


  // Edit leaves Modal Api Call
  editLeaves() {
    if (this.editLeaveadminForm.valid) {
      this.entreprise.id= this.editId
      this.entreprise.entreprise = this.editLeaveadminForm.value.Entreprise, 
      this.entreprise.description= this.editLeaveadminForm.value.Description,
      this.entreprise.adresse=this.editLeaveadminForm.value.Adress,
      this.entreprise.email=this.editLeaveadminForm.value.Email,
      this.entreprise.numTel=this.editLeaveadminForm.value.Phone
      };
      this.srvModuleService.update(this.entreprise,'Entreprise/update').subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.loadLeaves();
      });
      $("#edit_leave").modal("hide");
      this.toastr.success("Entreprise Updated sucessfully...!", "Success");
    } 
  // Delete leaves Modal Api Call
  deleteleaves() {
    this.srvModuleService.delete(this.tempId,'Entreprise/delete').subscribe((data) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      $("#datatable").DataTable().clear();
    this.loadLeaves();
    $("#delete_approve").modal("hide");
    this.toastr.success("Entreprise deleted sucessfully..!", "Success");
  });}

  // To Get The leaves Edit Id And Set Values To Edit Modal Form

  edit(value) {
    this.editId = value;
    const index = this.entreprises.findIndex((item) => {
      return item.id === value;
    });
    let toSetValues = this.entreprises[index];
    this.editLeaveadminForm.setValue({
      Entreprise:toSetValues.entreprise,
      Description:toSetValues.description,
      Phone:toSetValues.numTel,
      Adress: toSetValues.adresse,
      Email:toSetValues.email,

    })
   

  }

  //search by name
 /* searchName(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.employeeName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }
  

  //search by status
  searchType(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.leaveType.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }
  searchStatus(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.status.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by purchase
  searchByFrom(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      return d.from.indexOf(mySimpleFormat) !== -1 || !mySimpleFormat;
    });
    this.rows.push(...temp);
    $(".floating")
      .on("focus blur", function (e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");
  }

  //search by warranty
  searchByTo(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      return d.to.indexOf(mySimpleFormat) !== -1 || !mySimpleFormat;
    });
    this.rows.push(...temp);
    $(".floating")
      .on("focus blur", function (e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");
  }*/

  //getting the status value
 /* getStatus(data) {
    this.statusValue = data;
  }**/
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
