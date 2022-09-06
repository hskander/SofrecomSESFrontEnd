import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AllModulesService } from "../../all-modules.service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { Diplome } from "src/models/diplome";

declare const $: any;
@Component({
  selector: "app-training-list",
  templateUrl: "./training-list.component.html",
  styleUrls: ["./training-list.component.css"],
})
export class TrainingListComponent implements OnInit, OnDestroy {
  lstTraininglist: any[];
  url: any = "traininglist";
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  public tempId: any;
  public editId: any;

  public rows = [];
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public addTrainerForm: FormGroup;
  public editTrainerForm: FormGroup;
  public diplomes: Diplome[]=[];
  public diplome: Diplome= new $;
  public start;
  public end;
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    
    this.loadtrainerlist();
   
    this.addTrainerForm = this.formBuilder.group({
      nomDiplome: ["", [Validators.required]],
      Description: ["", [Validators.required]],
     
    });

    this.editTrainerForm = this.formBuilder.group({
      editDiplome: ["", [Validators.required]],
      editDescription: ["", [Validators.required]],
    });
  }

 
  // Get  trainer Api Call
  loadtrainerlist() {
    this.srvModuleService.get('Diplome/all').subscribe((data) => {
      this.diplomes = data;
      this.dtTrigger.next();
      this.rows = this.diplomes;
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

  // Add  goal type  Modal Api Call
  addTrainingType() {
    /*if(this.addTrainerForm.invalid){
      this.markFormGroupTouched(this.addTrainerForm)
      return
    }*/
    //if (this.addTrainerForm.valid) {
      this.diplome.id=null;
      this.diplome.diplome=this.addTrainerForm.value.nomDiplome;
      this.diplome.descriptionDiplome=this.addTrainerForm.value.Description;
     
      console.log(this.diplome);
      this.srvModuleService.add(this.diplome,'Diplome/addDiplome').subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
      
      });
      $("#datatable").DataTable().clear();
      this.loadtrainerlist();
      $("#add_training").modal("hide");
      this.addTrainerForm.reset();
      this.toastr.success("Diplome added sucessfully...!", "Success");
    });
   // }
  }

  // to know the date picker changes

  
  editTrainingType() {
    if (this.editTrainerForm.valid) {
      this.diplome.id= this.editId;
      this.diplome.diplome=this.editTrainerForm.value.editDiplome;
      this.diplome.descriptionDiplome=this.editTrainerForm.value.editDescription;
      };
      this.srvModuleService.update(this.diplome,'Diplome/update').subscribe((data1) => {
        $("#datatable").DataTable().clear();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.loadtrainerlist();
        $("#edit_training").modal("hide");
        this.toastr.success("Training Updated sucessfully...!", "Success");
      });
    }
  

  // To Get The goal type Edit Id And Set Values To Edit Modal Form
  edit(value) {
    this.editId = value;
    const index = this.diplomes.findIndex((item) => {
      return item.id === value;
    });
    let toSetValues = this.diplomes[index];
    this.editTrainerForm.setValue({
      editDiplome: toSetValues.diplome,
      editDescription: toSetValues.descriptionDiplome,
    });
  }

  // Delete holidays Modal Api Call

  deleteTraining() {
    this.srvModuleService.delete(this.tempId,'Diplome/delete').subscribe((data) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.loadtrainerlist();
    });
    $("#delete_training").modal("hide");
      this.toastr.success("Diplome Deleted", "Success");
  }

  // To Get The holidays Edit Id And Set Values To Edit Modal Form


 /* //getting the status value
  getStatus(data) {
    this.statusValue = data;
  }*/
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}



