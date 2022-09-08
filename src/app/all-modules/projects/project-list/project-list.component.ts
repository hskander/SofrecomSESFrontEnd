import { DatePipe } from "@angular/common";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { AllModulesService } from "../../all-modules.service";
import {Projet } from 'src/models/projet';

declare const $: any;
@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.css"],
})
export class ProjectListComponent implements OnInit, OnDestroy {
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
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private allModulesService: AllModulesService
  ) {}

  ngOnInit() {
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
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
    this.projets = [];
    this.getProjects();
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000);
  }
  getProjects() {
    this.allModulesService.get("Projet/allProjets").subscribe((data) => {
      this.projets = data;
      this.rows = this.projets;
      this.srch = [...this.rows];
    });
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

  //Create New Project
  public addProject() {
    let StartDate = this.pipe.transform(
      this.addProjectForm.value.StartDate,
      "dd-MM-yyyy"
    );
    let EndDate = this.pipe.transform(
      this.addProjectForm.value.EndDate,
      "dd-MM-yyyy"
    );
   // let newProject = {
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
    this.allModulesService.add(this.projet, 'Projet/addProjet').subscribe((data) => {
      $("#datatable").DataTable().clear();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.dtTrigger.next();
      this.getProjects();
    });
  
    this.addProjectForm.reset();
    $("#create_project").modal("hide");
    this.toastr.success("Project added sucessfully...!", "Success");
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
    
    this.allModulesService

      .update(this.projet, 'Projet/updateProjet')
      .subscribe((data) => {
        $("#datatable").DataTable().clear();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.dtTrigger.next();
        this.getProjects();
      });
    
    this.editProjectForm.reset();
    $("#edit_project").modal("hide");
    this.toastr.success("Project updated sucessfully...!", "Success");
  }

  //Delete project
  public deleteProject() {
    this.allModulesService.delete(this.tempId,'Projet/deleteProjet').subscribe((data) => {
      $("#datatable").DataTable().clear();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.dtTrigger.next();
      this.getProjects();
    });
    
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