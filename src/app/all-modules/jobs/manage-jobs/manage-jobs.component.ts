import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { AllModulesService } from "../../all-modules.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { DatePipe } from "@angular/common";
import { Poste } from 'src/models/Poste';

declare const $: any;
@Component({
  selector: "app-manage-jobs",
  templateUrl: "./manage-jobs.component.html",
  styleUrls: ["./manage-jobs.component.css"],
})
export class ManageJobsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  public url: any = "manageJobs";
  public allManageJobs: any = [];
  public postes: Poste[];
  public poste:Poste=new $;
  public srch:any[] = [];
  public rows:any[] = [];
  public addManageJobs: FormGroup;
  public editManageJobs: FormGroup;
  public editId: any;
  public tempId: any;
  public pipe = new DatePipe("en-US");
  public purchaseDateFormat;
  public purchaseToDateFormat;
  constructor(
    private allModuleService: AllModulesService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getManageJobs();

    // Add Provident Form Validation And Getting Values

    this.addManageJobs = this.formBuilder.group({
      Poste: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      
    });

    // Edit Provident Form Validation And Getting Values

    this.editManageJobs = this.formBuilder.group({
      editPoste: ["", [Validators.required]],
      editDescription: ["", [Validators.required]],
    });

    // for data table configuration
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
  }

  getManageJobs() {
    console.log(this.srch);
    this.allModuleService.get('Poste/all').subscribe((data) => {
      this.postes = data;
      this.dtTrigger.next();
      this.rows = this.postes;
      this.srch = [...this.rows];
    });
    console.log(this.srch);
  }

  // Add Provident Modal Api Call

  addJobs() {
    if (this.addManageJobs.valid) {
     this.poste.id=null;
      this.poste.poste= this.addManageJobs.value.Poste;
      this.poste.description=this.addManageJobs.value.Description;
      this.allModuleService.add(this.poste, 'Poste/add').subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        $("#datatable").DataTable().clear();
        this.getManageJobs();
      });
     
      $("#add_job").modal("hide");
      this.addManageJobs.reset();
      this.toastr.success("Job is added", "Success");
    }
  }
  

  // Edit Provident Modal Api Call

  editJobs() {
    this.poste.id=this.editId;
      this.poste.poste= this.editManageJobs.value.editPoste;
      this.poste.description=this.editManageJobs.value.editDescription;
      console.log(this.poste);
    this.allModuleService.update(this.poste, 'Poste/update').subscribe((data1) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      $("#datatable").DataTable().clear();
      this.getManageJobs();
    });
    
    $("#edit_job").modal("hide");
    this.toastr.success("Job is edited", "Success");
  }

  edit(value) {
    this.editId = value;
    const index = this.postes.findIndex((item) => {
      return item.id === value;
    });
    let toSetValues = this.postes[index];
    this.editManageJobs.setValue({
      editPoste: toSetValues.poste,
      editDescription: toSetValues.description,
    });
  }

  // Delete Provident Modal Api Call

  deleteJobs() {
    this.allModuleService.delete(this.tempId, 'Poste/delete').subscribe((data) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      $("#datatable").DataTable().clear();
      this.getManageJobs();
      $("#delete_job").modal("hide");
      this.toastr.success("Job is deleted", "Success");
    });
  }
  searchPoste(key) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      key = key.toLowerCase();
      return d.poste.toLowerCase().indexOf(key) !== -1 
      || d.description.toLowerCase().indexOf(key) !== -1
      || !key;
    });
    this.rows.push(...temp);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
