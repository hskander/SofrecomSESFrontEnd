import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Employee } from 'src/models/employee';
import { Pole } from 'src/models/pole';
import { Poste } from 'src/models/poste';
import { AllModulesService } from "../../../all-modules.service";
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from "@angular/router";
import { map, mergeMap } from "rxjs/operators";
import { DiplomeDetails } from 'src/models/diplomeDetails';
import {Experience} from 'src/models/experience';
import { DataTableDirective } from "angular-datatables";
import { DatePipe } from "@angular/common";
import { Subject } from 'rxjs';
import { Direction } from 'ngx-bootstrap/carousel/carousel.component';

declare const $: any;

@Component({
  selector: "app-employee-profile",
  templateUrl: "./employee-profile.component.html",
  styleUrls: ["./employee-profile.component.css"],
})
export class EmployeeProfileComponent implements OnInit {
  
  public dtElement: DataTableDirective;
  public dtTrigger: Subject<any> = new Subject();
  public editId: any;
  public addEmployeeForm: FormGroup;
  public editEmployeeForm: FormGroup;
  public employee : Employee;
  public experience : Experience[]=[];
  public emp : any;
  public poles : Pole[] = [];
  public postes:Poste[] = [];
  public diplomeDetails : DiplomeDetails[] = [];
  public empId:any;
  public poleManager:Employee = $;
  public pole:Pole= $;
  public direction:Direction= $;
  public directionManager:Employee = $;
  public pipe = new DatePipe("en-US");
  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private allModulesService: AllModulesService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
  this.getEmp();
  
  this.editEmployeeForm = this.formBuilder.group({
    FirstName: ["", [Validators.required]],
    LastName: ["", [Validators.required]],
    Adresse: ["", [Validators.required]],
    Nationalite: ["", [Validators.required]],
    NumPasseport: [""],
    dateExpPasseport: [""],
    CIN: ["", [Validators.required]],
    dateDelivCIN: ["", [Validators.required]],
    Civilite: [""],
    SituationFam: ["", [Validators.required]],
    NbEnfant: ["", [Validators.required]],
    MatriculeCNSS: [""],
    CNSS: ["", [Validators.required]],
    BankName: [""],
    SWIFT: [""],
    RIB: [""],
    IBAN: [""],
    EnConge: ["", [Validators.required]],
    Poste: ["", [Validators.required]],
    Pole: [""],
    Email: ["", [Validators.required]],
    NumTel: ["", [Validators.required]],
    dateNaissance: ["", [Validators.required]],
    Salaire: ["", [Validators.required]],
    lieuNaissance: [""],
    dateRecrut: ["", [Validators.required]],
    dateDepart: [""],
    Genre: ["", [Validators.required]],
    NomURG: [""],
    TelURG: ["", [Validators.required]],
    RelationURG: [""],
    Image: [""],
    ImageName: [""],
  });
  }
    // Get pole list  Api Call
    getPoles(): void {
      this.allModulesService.get('Pole/all').subscribe(
        (response: Pole[]) => {
          this.poles= response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }

         // Get experience list  Api Call
         getExperience(): void {
          this.allModulesService.get('Experience/all').subscribe(
            (response: Experience[]) => {
              this.experience= response;
              //console.log(this.experience);
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        }
        getEmployePole(){
          this.allModulesService.getOne(`Employee/findEmployePole?id=${this.route.snapshot.params.id}`).subscribe(
            (response: Pole) => {
              this.pole= response;
              this.poleManager=this.pole.manager;
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        }
        
         //Get Employee Pole Manager
         getDirectionManager(): void{
          this.allModulesService.getOne(`Employee/findEmployeDirectionManager?id=${this.route.snapshot.params.id}`).subscribe(
            (response: Employee) => {
              this.directionManager= response;
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        }
        findDirectionByManager(){
          this.allModulesService.getOne(`Direction/findDirectionByManager?id=${this.route.snapshot.params.id}`).subscribe(
            (response: Direction) => {
              this.direction= response;
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        }
    // Get Employee By ID list  Api Call
  getEmp(): void {
    this.viderEmp();
    this.allModulesService.getOne(`Employee/find?id=${this.route.snapshot.params.id}`).subscribe(
      (response: Employee) => {
        this.employee= response;
        this.getEmployePole();
        this.findDirectionByManager();
        this.getDirectionManager();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  viderEmp(){
    this.employee= new $;
  }
  loadPostes(){
    this.allModulesService.get('Poste/all').subscribe(
      (response: Poste[]) =>{
        this.postes=response;
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    );
  }
  editEmployeePole(poleId){
    this.allModulesService.update(this.employee,`Employee/editEmployeePole?employeeId=${this.route.snapshot.params.id}&poleId=${poleId}`)
    .subscribe((data1) => {

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

  editEmployee() {
    if(this.editEmployeeForm.invalid){
      this.markFormGroupTouched(this.editEmployeeForm)
      return
    }
    let dateExpPasseport = this.pipe.transform(
      this.editEmployeeForm.value.dateExpPasseport,
      "yyyy-MM-dd"
    );
    let dateDelivCIN = this.pipe.transform(
      this.editEmployeeForm.value.dateDelivCIN,
      "yyyy-MM-dd"
    );
    let dateNaissance = this.pipe.transform(
      this.editEmployeeForm.value.dateNaissance,
      "yyyy-MM-dd"
    );
    let dateRecrut = this.pipe.transform(
      this.editEmployeeForm.value.dateRecrut,
      "yyyy-MM-dd"
    );
    let dateDepart = this.pipe.transform(
      this.editEmployeeForm.value.dateDepart,
      "yyyy-MM-dd"
    );
    this.employee.id=this.employee.id;
    this.employee.nom=this.editEmployeeForm.value.FirstName;
    this.employee.prenom=this.editEmployeeForm.value.LastName;
    this.employee.genre=this.editEmployeeForm.value.Genre;
    this.employee.adresse=this.editEmployeeForm.value.Adresse;
    this.employee.dateNaissance=dateNaissance;
    this.employee.lieuNaissance=this.editEmployeeForm.value.lieuNaissance;
    this.employee.nationalite=this.editEmployeeForm.value.Nationalite;
    this.employee.image=this.editEmployeeForm.value.Image;
    this.employee.mail=this.editEmployeeForm.value.Email;
    this.employee.dateRecrut=dateRecrut;
    this.employee.dateDepart=dateDepart;
    this.employee.numTel=this.editEmployeeForm.value.NumTel;
    this.employee.nomUrgence=this.editEmployeeForm.value.NomURG;
    this.employee.numUrgence=this.editEmployeeForm.value.TelURG;
    this.employee.relationUrgence=this.editEmployeeForm.value.RelationURG;
    this.employee.numPasseport=this.editEmployeeForm.value.NumPasseport;
    this.employee.dateExpPasseport=dateExpPasseport;
    this.employee.numCin=this.editEmployeeForm.value.CIN;
    this.employee.delivDate=dateDelivCIN;
    this.employee.civilite=this.editEmployeeForm.value.Civilite;
    this.employee.situationFam=this.editEmployeeForm.value.SituationFam;
    this.employee.nbEnfant=this.editEmployeeForm.value.NbEnfant;
    this.employee.salaireBrute=this.editEmployeeForm.value.Salaire;
    this.employee.cnss=this.editEmployeeForm.value.CNSS;
    this.employee.matriculeCnss=this.editEmployeeForm.value.MatriculeCNSS;
    this.employee.bankName=this.editEmployeeForm.value.BankName;
    this.employee.swift=this.editEmployeeForm.value.SWIFT;
    this.employee.rib=this.editEmployeeForm.value.RIB;
    this.employee.iban=this.editEmployeeForm.value.IBAN;
    this.employee.enConge=this.editEmployeeForm.value.EnConge;
    this.employee.poste=this.editEmployeeForm.value.Poste;
    if(this.editEmployeeForm.value.Image){
      this.employee.image=this.editEmployeeForm.value.Image.slice(12,this.editEmployeeForm.value.Image.length);
    }else{
      this.employee.image=this.editEmployeeForm.value.ImageName;
    }
    this.allModulesService.update(this.employee,'Employee/editEmployee').subscribe((data1) => {
      if(this.editEmployeeForm.value.Pole.id){
        this.editEmployeePole(this.editEmployeeForm.value.Pole.id);
      }
     this.ngOnInit();
    });
    
    $("#edit_employee").modal("hide");
    this.toastr.success("Employeee Updated sucessfully...!", "Success");
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  editEmp() {
    this.loadPostes();
  this.getPoles();
    let toSetValues:Employee = this.employee;
    this.editEmployeeForm.setValue({
      FirstName: toSetValues.nom,
      LastName: toSetValues.prenom,
      Adresse: toSetValues.adresse,
      Nationalite: toSetValues.nationalite,
      NumPasseport: toSetValues.numPasseport,
      dateExpPasseport: toSetValues.dateExpPasseport,
      CIN: toSetValues.numCin,
      dateDelivCIN: toSetValues.delivDate,
      Civilite:toSetValues.civilite,
      SituationFam: toSetValues.situationFam,
      NbEnfant: toSetValues.nbEnfant,
      MatriculeCNSS: toSetValues.matriculeCnss,
      CNSS: toSetValues.cnss,
      BankName: toSetValues.bankName,
      SWIFT: toSetValues.swift,
      RIB: toSetValues.rib,
      IBAN: toSetValues.iban,
      EnConge: toSetValues.enConge,
      Poste: toSetValues.poste,
      Pole: this.pole,
      Email: toSetValues.mail,
      NumTel: toSetValues.numTel,
      dateNaissance: toSetValues.dateNaissance,
      Salaire:toSetValues.salaireBrute,
      lieuNaissance: toSetValues.lieuNaissance,
      dateRecrut: toSetValues.dateRecrut,
      dateDepart: toSetValues.dateDepart,
      Genre: toSetValues.genre,
      NomURG: toSetValues.nomUrgence,
      TelURG: toSetValues.numUrgence,
      RelationURG: toSetValues.relationUrgence,
      Image:null,
      ImageName: toSetValues.image,

    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onSubmit() {
    this.toastr.success("Bank & statutory added", "Success");
  }
}
