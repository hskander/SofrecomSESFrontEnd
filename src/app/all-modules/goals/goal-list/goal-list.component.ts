import { Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AllModulesService } from "../../all-modules.service";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { Certificat } from 'src/models/certificat';
import { HttpErrorResponse } from '@angular/common/http';
declare const $: any;
@Component({
  selector: "app-goal-list",
  templateUrl: "./goal-list.component.html",
  styleUrls: ["./goal-list.component.css"],
})
export class GoalListComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  public lstGoal: any[];
  public url: any = "goals";
  public tempId: any;
  public editId: any;
  public rows:any[] = [];
  public srch:any[] = [];
  public addGoalForm: FormGroup;
  public editGoalForm: FormGroup;
  public certificats: Certificat[]=[];
  public certificat: Certificat= new $;
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
    this.LoadGoal();

    this.addGoalForm = this.formBuilder.group({
      Certificat: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      Online: ["", [Validators.required]],
    });

    this.editGoalForm = this.formBuilder.group({
      Certificat: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      Online: ["", [Validators.required]],
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

  // Get goal list  Api Call
  LoadGoal() {
    this.srvModuleService.get('Certificat/all').subscribe((data) => {
      this.certificats = data;
      this.dtTrigger.next();
      this.rows = this.certificats;
      this.srch = [...this.rows];
    });
  }

  // Add Goal  Modal Api Call
  addGoal() {
    
    if(this.addGoalForm.invalid){
      this.markFormGroupTouched(this.addGoalForm)
      return
    }
    if (this.addGoalForm.valid) {
      this.certificat.certificat=this.addGoalForm.value.Certificat;
      this.certificat.descriptionCertificat=this.addGoalForm.value.Description;
      this.certificat.enLigne=this.addGoalForm.value.Online;
      console.log(this.certificat);
      this.srvModuleService.add(this.certificat,'Certificat/addCertificat').subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        $("#datatable").DataTable().clear();
        this.LoadGoal();
      $("#add_goal").modal("hide");
      this.addGoalForm.reset();
      this.toastr.success("Certificat added sucessfully...!", "Success");
      });
    }
  }


  editGoal() {
    if (this.editGoalForm.valid) {
        this.certificat.id= this.editId
        this.certificat.certificat=this.editGoalForm.value.Certificat,
        this.certificat.descriptionCertificat=this.editGoalForm.value.Description,
        this.certificat.enLigne=this.editGoalForm.value.Online  
      };
      this.srvModuleService.update(this.certificat,'Certificat/update').subscribe((data1) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.LoadGoal();
      });
      
      $("#edit_goal").modal("hide");
      this.toastr.success("Certificat Updated sucessfully...!", "Success");
    }
  

  // To Get The Goal Edit Id And Set Values To Edit Modal Form
  edit(value) {
    this.editId = value;
    const index = this.certificats.findIndex((item) => {
      return item.id === value;
    });
    let toSetValues = this.certificats[index];
    this.editGoalForm.setValue({
      Certificat: toSetValues.certificat,
      Description:toSetValues.descriptionCertificat,
      Online:toSetValues.enLigne
    });
  }


  deleteCertificat() {
    this.srvModuleService.delete(this.tempId,'Certificat/delete').subscribe((data) => {
      $("#datatable").DataTable().clear();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.LoadGoal();
      });
     
      });
      $("#delete_certificat").modal("hide");
      this.toastr.success("Certificat deleted sucessfully..!", "Success");
   
  }
  
  searchCertificat(key) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (certif) {
      key = key.toLowerCase();
      return certif.certificat.toLowerCase().indexOf(key) !== -1 || !key;
    });
    this.rows.push(...temp);
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe()
  }
}
