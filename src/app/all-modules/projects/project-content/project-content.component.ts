import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AllModulesService } from "../../all-modules.service";
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import {Projet } from 'src/models/projet';
import { DatePipe } from "@angular/common";
import { DataTableDirective } from "angular-datatables";

declare const $: any;
@Component({
  selector: "app-project-content",
  templateUrl: "./project-content.component.html",
  styleUrls: ["./project-content.component.css"],
})
export class ProjectContentComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public projects:any = [];
  public addProjectForm: FormGroup;
  public editProjectForm: FormGroup;
  public tempId: any;
  public projets: Projet[]=[];
  public projet: Projet= new $;
  public rows = [];
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public pipe = new DatePipe("en-US");
  constructor(
    private allModulesService: AllModulesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    $(document).ready(function () {
      $('[data-bs-toggle="tooltip"]').tooltip();
    });
    this.getProjects();
    //Add Projects form
    this.addProjectForm = this.formBuilder.group({
      Project: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      StartDate: ["", [Validators.required]],
      EndDate: ["", [Validators.required]],
      Ongoing:["", [Validators.required]],
    /*  projectPriority: ["", [Validators.required]],
     projectLeader: ["", [Validators.required]],
      addTeamMembers: ["", [Validators.required]],
      projectId: ["", [Validators.required]],
      id: ["", [Validators.required]],*/
    });

    //Edit Projects Form
    this.editProjectForm = this.formBuilder.group({
      editProject: ["", [Validators.required]],
      editDescription: ["", [Validators.required]],
    editStartDate: ["", [Validators.required]],
    editEndDate: ["", [Validators.required]],
      editOngoing:["", [Validators.required]],
     /* editProjectPriority: ["", [Validators.required]],
      editaddTeamMembers: ["", [Validators.required]],
      editProjectId: ["", [Validators.required]],
      editId: ["", [Validators.required]],*/
    });
  }

  getProjects() {
    this.allModulesService.get('Projet/allProjets').subscribe((data) => {
      this.projets = data;
      this.dtTrigger.next();
      this.rows = this.projets;
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


  //Create New Project
  public addProject() {
    if(this.addProjectForm.invalid){
      this.markFormGroupTouched(this.addProjectForm)
      return
    }
    let StartDate = this.pipe.transform(
      this.addProjectForm.value.StartDate,
      "dd-MM-yyyy"
    );
    let EndDate = this.pipe.transform(
      this.addProjectForm.value.EndDate,
      "dd-MM-yyyy"
    );
 //  let newProject = {
   this.projet.id=null;
      this.projet.projet=this.addProjectForm.value.Project;
      this.projet.description=this.addProjectForm.value.Description;
      this.projet.dateDebut=this.addProjectForm.value.StartDate;
      this.projet.dateFin=this.addProjectForm.value.EndDate;
      this.projet.enCours=this.addProjectForm.value.Ongoing;
    /*  priority: this.addProjectForm.value.projectPriority,
      projectleader: this.addProjectForm.value.projectLeader,
      teamMember: this.addProjectForm.value.addTeamMembers,
      projectId: "PRO-0012",
      id: "",
    };*/
    console.log(this.projet);
    this.allModulesService.add(this.projet, 'Projet/addProjet').subscribe((data)=>{
      this.getProjects();
    $("#create_project").modal("hide");
    this.addProjectForm.reset();
    });
    
    this.toastr.success("Project added sucessfully...!", "Success");
  }

  //Edit project
  editProject(id: any) {
    this.tempId = id;
    const index = this.projets.findIndex((item) => {
      return item.id === id;
    });
    let toSetValues = this.projets[index];
    this.editProjectForm.setValue({
      editProject: toSetValues.projet,
      editDescription: toSetValues.description,
      editOngoing:toSetValues.enCours,

     editEndDate: toSetValues.dateFin,
     editStartDate: toSetValues.dateDebut,
     /* editProjectPriority: toSetValues.priority,
      editaddTeamMembers: toSetValues.teamMember,
      editProjectId: toSetValues.projectId,
      editId: toSetValues.id,*/
    });
  }

  

  //Save Project
  public saveProject() {
    let StartDate = this.pipe.transform(
      this.editProjectForm.value.editStartDate,
      "dd-MM-yyyy"
    );
    let EndDate = this.pipe.transform(
      this.editProjectForm.value.editEndDate,
      "dd-MM-yyyy"
    );
   // let editedProject = {
    this.projet.id = this.tempId,
    this.projet.description= this.editProjectForm.value.editDescription,
    this.projet.projet= this.editProjectForm.value.editProject,
    this.projet.dateDebut= this.editProjectForm.value.editStartDate,
    this.projet.dateFin= this.editProjectForm.value.editEndDate,
    this.projet.enCours= this.editProjectForm.value.editOngoing,
     /* priority: this.editProjectForm.value.editProjectPriority,
      teamMember: this.editProjectForm.value.editaddTeamMembers,
      projectId: this.editProjectForm.value.editProjectPriority,
      id: this.tempId,*/

    this.allModulesService.update(this.projet, 'Projet/updateProjet').subscribe((data1) => {
      this.getProjects();
      this.editProjectForm.reset();
    }); 
    $("#edit_project").modal("hide");
    this.toastr.success("Project updated sucessfully...!", "Success");
  }


  //Delete project
  public deleteProject() {
    this.allModulesService.delete(this.tempId,'Projet/deleteProjet').subscribe((data)=>
    this.getProjects()
  );
    
    $("#delete_project").modal("hide");
    this.toastr.success("Project deleted sucessfully...!", "Success");
  }

  

  //search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.projet.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // for unsubscribe datatable
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
