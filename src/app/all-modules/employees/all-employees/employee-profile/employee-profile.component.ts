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
import { Diplome } from 'src/models/Diplome';
import { Certificat } from 'src/models/Certificat';
import { CertificatDetails } from 'src/models/CertificatDetails';
import { Institut } from 'src/models/Institut';
import { CentreFormation } from 'src/models/CentreFormation';
import { Entreprise } from 'src/models/Entreprise';

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
  public senioriteEmp;
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

  /* Salmaa*/
  public diplomes: Diplome[] = [];
  public certificats: Certificat[] = [];
  public diplomeDT : DiplomeDetails=  new $;
  public certifDT : CertificatDetails=  new $;
  public instituts : Institut[] = [];
  public centreFormations : CentreFormation[] = [];
  public experiences : Experience[] = [];
  public experience : Experience = new $;
  public entreprises : Entreprise[] = [];
  public ddId:any;
  public cdId: any;
  public expId: any;
  public affectDiplomeForm : FormGroup;
  public affectCertificatForm : FormGroup;
  public affectExperienceForm : FormGroup;
  public editExperienceForm : FormGroup;
  public editCertificatForm : FormGroup;
  public editDiplomeDTForm: FormGroup;
  /* Salmaa*/
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
  //Salmaa
  this.getInstitut();
    this.getDiplome();
    this.getCentreF();
    this.getCertificat();
    this.getEntreprises();



    this.affectExperienceForm=this.formBuilder.group({
      DateDebutExp: ["", [Validators.required]],
      DateFinExp: ["", [Validators.required]],
      Poste: ["", [Validators.required]],
      SalaireBrute: ["", [Validators.required]],
      Entreprise: ["", [Validators.required]],
      RaisonDepart: ["", [Validators.required]],

    });

    this.affectDiplomeForm=this.formBuilder.group({
      Institut: ["", [Validators.required]],
      Diplome: ["", [Validators.required]],
      Mention:  ["", [Validators.required]],
      DateDebutFomation : ["", [Validators.required]],
      DateObtention : ["", [Validators.required]],

    });

    this.affectCertificatForm=this.formBuilder.group({
      CentreF: ["", [Validators.required]],
      Certificat: ["", [Validators.required]],
      DateDebutCertif : ["", [Validators.required]],
      DateFinCertif : ["", [Validators.required]],
      Note : ["", [Validators.required]],
    });

    this.editDiplomeDTForm = this.formBuilder.group({
      editInstitut: ["", [Validators.required]],
      editDiplome: ["", [Validators.required]],
      editMention:  ["", [Validators.required]],
      editDateDebutFomation : ["", [Validators.required]],
      editDateObtention : ["", [Validators.required]],
    });
  
    this.editCertificatForm=this.formBuilder.group({
      editCentreF: ["", [Validators.required]],
      editCertificat: ["", [Validators.required]],
      editDateDebutCertif : ["", [Validators.required]],
      editDateFinCertif : ["", [Validators.required]],
      editNote : ["", [Validators.required]],

    });

    this.editExperienceForm=this.formBuilder.group({
      editDateDebutExp: ["", [Validators.required]],
      editDateFinExp: ["", [Validators.required]],
      editPoste: ["", [Validators.required]],
      editSalaireBrute: ["", [Validators.required]],
      editEntreprise: ["", [Validators.required]],
      editRaisonDepart: ["", [Validators.required]],

    });
  //Salma
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
        let dateRecrut = this.pipe.transform(
          this.employee.dateRecrut,
          "yyyy-MM-dd"
        );
        if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))<1 && !this.employee.dateDepart){
          this.senioriteEmp= "Amateur";
        }
        if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))<2&&new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))>=1 && !this.employee.dateDepart){
          this.senioriteEmp= "Junior1";
        }
        if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))<3 && new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))>=2 && !this.employee.dateDepart){
          this.senioriteEmp= "Junior2";
        }
        if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))<5 && new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))>=3&& !this.employee.dateDepart){
          this.senioriteEmp= "Confirmé";
        }
        if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))<7 && new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))>=5 && !this.employee.dateDepart){
          this.senioriteEmp= "Senior1";
        }
        if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))<10 && new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))>=7 && !this.employee.dateDepart){
          this.senioriteEmp= "Senior2";
        }
        if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))>=10 && !this.employee.dateDepart){
          this.senioriteEmp= "Senior3";
        }

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
  //Salma
  // Get instituts list  Api Call
  getInstitut(): void {
    this.allModulesService.get('Institut/all').subscribe(
      (response: Institut[]) => {
        this.instituts= response
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

      // Get entreprises list  Api Call
      getEntreprises(): void {
        this.allModulesService.get('Entreprise/all').subscribe(
          (response: Entreprise[]) => {
            this.entreprises= response;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }

  // Get CentreF list  Api Call
  getCentreF(): void {
      this.allModulesService.get('CentreFormation/all').subscribe(
        (response: CentreFormation[]) => {
          this.centreFormations= response;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }

    // Get Certificat list  Api Call
  getCertificat(): void {
    this.allModulesService.get('Certificat/all').subscribe(
      (response: Certificat[]) => {
        this.certificats= response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }  
   // Get directions list  Api Call
   getDiplome(): void {
    this.allModulesService.get('Diplome/all').subscribe(
      (response: Diplome[]) => {
        this.diplomes= response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  };

  // Affect Diplome  Modal Api Call
addDiplomeDetailsEmp() {
  if(this.affectDiplomeForm.invalid){
    this.markFormGroupTouched(this.affectDiplomeForm)
    return
  }
  
  if (this.affectDiplomeForm.valid) {
     this.diplomeDT.id=null;
      this.diplomeDT.institut =  this.affectDiplomeForm.value.Institut;
      this.diplomeDT.diplome =  this.affectDiplomeForm.value.Diplome;
      this.diplomeDT.mention =  this.affectDiplomeForm.value.Mention;
      this.diplomeDT.dateDebutFomation= this.affectDiplomeForm.value.DateDebutFomation ;
      this.diplomeDT.dateObtention = this.affectDiplomeForm.value.DateObtention ;
    this.allModulesService.add(this.diplomeDT,`Employee/AffecterDiplomeEmployee?employeId=${this.employee.id}&diplomeId=${this.affectDiplomeForm.value.Diplome.id}&institutId=${this.affectDiplomeForm.value.Institut.id}`).subscribe((data) => {
         this.getEmp();   
         $("#education_info").modal("hide");
         this.affectDiplomeForm.reset();
         this.toastr.success("Desigantion added sucessfully...!", "Success");
      });
  }
}

// Affect Certificat  Modal Api Call
addCertificatDetailsEmp() {
  if(this.affectCertificatForm.invalid){
    this.markFormGroupTouched(this.affectCertificatForm)
    return
  }
  
  if (this.affectCertificatForm.valid) {
     this.certifDT.id=null;
      this.certifDT.dateDebutFormation =  this.affectCertificatForm.value.DateDebutCertif;
      this.certifDT.dateObtention =  this.affectCertificatForm.value.DateFinCertif;
      this.certifDT.note =  this.affectCertificatForm.value.Note;
      this.certifDT.certificat= this.affectCertificatForm.value.Certificat ;
      this.certifDT.centreFormation= this.affectCertificatForm.value.CentreF;

    this.allModulesService.add(this.certifDT,`Employee/AffecterCertificatEmployee?employeId=${this.employee.id}&certificatId=${this.affectCertificatForm.value.Certificat.id}&centreFormationId=${this.affectCertificatForm.value.CentreF.id}`).subscribe((data) => {

         this.getEmp();   
         $("#Certif_info").modal("hide");
         this.affectCertificatForm.reset();
         this.toastr.success("Desigantion added sucessfully...!", "Success");
      });
  }
}

// Affect Experience  Modal Api Call
addExperiencEmp() {
  if(this.affectExperienceForm.invalid){
    this.markFormGroupTouched(this.affectExperienceForm)
    return
  }
  
  if (this.affectExperienceForm.valid) {
     this.experience.id=null;
      this.experience.dateDebut =  this.affectExperienceForm.value.DateDebutExp;
      this.experience.dateFin =  this.affectExperienceForm.value.DateFinExp;
      this.experience.poste =  this.affectExperienceForm.value.Poste;
      this.experience.salaireBrute= this.affectExperienceForm.value.SalaireBrute ;
      this.experience.entreprise= this.affectExperienceForm.value.Entreprise;
      this.experience.raisonDepart= this.affectExperienceForm.value.RaisonDepart;
      

    this.allModulesService.add(this.experience,`Employee/AffecterExperienceEmployee?employeId=${this.employee.id}&entrepriseId=${this.affectExperienceForm.value.Entreprise.id}`).subscribe((data) => {

         this.getEmp();   
         $("#experience_info").modal("hide");
         this.affectExperienceForm.reset();
         this.toastr.success("Desigantion added sucessfully...!", "Success");
      });
  }
}

editDiplomeDetails() {
  if (this.editDiplomeDTForm.valid) {
      this.diplomeDT.id = this.ddId;
      this.diplomeDT.diplome = this.editDiplomeDTForm.value.editDiplome,
      this.diplomeDT.institut = this.editDiplomeDTForm.value.editInstitut;
      this.diplomeDT.mention = this.editDiplomeDTForm.value.editMention;
      this.diplomeDT.dateObtention = this.editDiplomeDTForm.value.editDateObtention;
      this.diplomeDT.dateDebutFomation = this.editDiplomeDTForm.value.editDateDebutFomation;
      this.allModulesService.update(this.diplomeDT,`Employee/editDiplomeDetails?id=${this.employee.id}`).subscribe((data1) => {
      this.getEmp();
      $("#edit_education_info").modal("hide");
      this.toastr.success("Department Updated sucessfully...!", "Success");
    });
  }
}

// To Get The timesheet Edit Id And Set Values To Edit Modal Form
editDip(value) {
  this.ddId = value;
  const index = this.employee.listDiplomeDetails
  .findIndex((item) => {
    return item.id === value;
});
  let toSetValues = this.employee.listDiplomeDetails[index];
  this.editDiplomeDTForm.setValue({
  
    editInstitut: toSetValues.institut,
    editDiplome: toSetValues.diplome,
    editMention: toSetValues.mention,
    editDateDebutFomation: toSetValues.dateDebutFomation,
    editDateObtention: toSetValues.dateObtention,
  
  });
}

editCertificatDetails() {
  if (this.editCertificatForm.valid) {
      this.certifDT.id = this.cdId;
      this.certifDT.dateDebutFormation =  this.editCertificatForm.value.editDateDebutCertif;
      this.certifDT.dateObtention =  this.editCertificatForm.value.editDateFinCertif;
      this.certifDT.note =  this.editCertificatForm.value.editNote;
      this.certifDT.certificat= this.editCertificatForm.value.editCertificat ;
      this.certifDT.centreFormation= this.editCertificatForm.value.editCentreF;

      this.allModulesService.update(this.certifDT,`Employee/editCertificatDetails?id=${this.employee.id}`).subscribe((data1) => {
      this.getEmp();
      $("#Edit_Certif_info").modal("hide");
      this.toastr.success("Department Updated sucessfully...!", "Success");
    });
  }
}

// To Get The timesheet Edit Id And Set Values To Edit Modal Form
editCertif(value) {
  this.cdId=value;
  const index = this.employee.listCertificatDetails
  .findIndex((item) => {
    return item.id === value;
});
  let toSetValues = this.employee.listCertificatDetails[index];
  this.editCertificatForm.setValue({
    editDateDebutCertif: toSetValues.dateDebutFormation,
    editDateFinCertif: toSetValues.dateObtention,
    editNote: toSetValues.note,
    editCertificat: toSetValues.certificat,
    editCentreF: toSetValues.centreFormation,
  
  });
}

editExperience() {
  if (this.editExperienceForm.valid) {
      this.experience.id = this.expId;
      this.experience.dateDebut =  this.editExperienceForm.value.editDateDebutExp;
      this.experience.poste =  this.editExperienceForm.value.editPoste;
      this.experience.dateFin =  this.editExperienceForm.value.editDateFinExp;
      this.experience.salaireBrute= this.editExperienceForm.value.editSalaireBrute ;
      this.experience.raisonDepart= this.editExperienceForm.value.editRaisonDepart;
      this.experience.entreprise= this.editExperienceForm.value.editEntreprise;

      this.allModulesService.update(this.experience,`Experience/update?id=${this.employee.id}`).subscribe((data1) => {
      this.getEmp();
      $("#edit_experience_info").modal("hide");
      this.toastr.success("Department Updated sucessfully...!", "Success");
    });
  }
}

// To Get The timesheet Edit Id And Set Values To Edit Modal Form
editExp(value) {
  this.expId = value;
  const index = this.employee.experiences
  .findIndex((item) => {
    return item.id === value;
});
  let toSetValues = this.employee.experiences[index];
  this.editExperienceForm.setValue({
    editDateDebutExp: toSetValues.dateDebut,
    editDateFinExp: toSetValues.dateFin,
    editPoste: toSetValues.poste,
    editSalaireBrute: toSetValues.salaireBrute,
    editRaisonDepart: toSetValues.raisonDepart,
    editEntreprise: toSetValues.entreprise,
  
  });
}
//Salma
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onSubmit() {
    this.toastr.success("Bank & statutory added", "Success");
  }
}
