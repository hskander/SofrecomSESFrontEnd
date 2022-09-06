import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AllModulesService } from "src/app/all-modules/all-modules.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { id } from "src/assets/all-modules-data/id";
import { Employee } from 'src/models/employee';
import { Pole } from 'src/models/pole';
import { Poste } from 'src/models/Poste';
import { HttpErrorResponse } from '@angular/common/http';

declare const $: any;
@Component({
  selector: "app-employee-page-content",
  templateUrl: "./employee-page-content.component.html",
  styleUrls: ["./employee-page-content.component.css"],
})
export class EmployeePageContentComponent implements OnInit {
  public lstEmployee: any[];
  public url: any = "employeelist";
  public tempId: any;
  public editId: any;
  public addEmployeeForm: FormGroup;
  public editEmployeeForm: FormGroup;
  public employee:Employee= new $;
  public employees:Employee[]=[];
  public poles:Pole[];
  public postes: Poste[];
  public pipe = new DatePipe("en-US");
  public rows = [];
  public srch = [];
  public statusValue;
  constructor(
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loadEmployee();
    this.addEmployeeForm = this.formBuilder.group({
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
      Pole: [null],
      Poste: ["", [Validators.required]],
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
      
    });

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
    });
  }

  // Get Employee  Api Call
  loadEmployee() {
    this.srvModuleService.get('Employee/allEmployees').subscribe((data) => {
      this.employees = data;
      this.rows = this.employees;
      this.srch = [...this.rows];
    });
  }
  loadPoles(){
    this.srvModuleService.get('Pole/all').subscribe(
      (response: Pole[]) =>{
        this.poles=response;
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    );
  }
  loadPostes(){
    this.srvModuleService.get('Poste/all').subscribe(
      (response: Poste[]) =>{
        this.postes=response;
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    );
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Add employee  Modal Api Call
  addEmployee() {
    if(this.addEmployeeForm.invalid){
      this.markFormGroupTouched(this.addEmployeeForm)
      return
    }
    let dateExpPasseport = this.pipe.transform(
      this.addEmployeeForm.value.dateExpPasseport,
      "yyyy-MM-dd"
    );
    let dateDelivCIN = this.pipe.transform(
      this.addEmployeeForm.value.dateDelivCIN,
      "yyyy-MM-dd"
    );
    let dateNaissance = this.pipe.transform(
      this.addEmployeeForm.value.dateNaissance,
      "yyyy-MM-dd"
    );
    let dateRecrut = this.pipe.transform(
      this.addEmployeeForm.value.dateRecrut,
      "yyyy-MM-dd"
    );
    let dateDepart = this.pipe.transform(
      this.addEmployeeForm.value.dateDepart,
      "yyyy-MM-dd"
    );
    this.employee.id=null;
    this.employee.nom=this.addEmployeeForm.value.FirstName;
    this.employee.prenom=this.addEmployeeForm.value.LastName;
    this.employee.genre=this.addEmployeeForm.value.Genre;
    this.employee.adresse=this.addEmployeeForm.value.Adresse;
    this.employee.dateNaissance=dateNaissance;
    this.employee.lieuNaissance=this.addEmployeeForm.value.lieuNaissance;
    this.employee.nationalite=this.addEmployeeForm.value.Nationalite;
    this.employee.mail=this.addEmployeeForm.value.Email;
    this.employee.dateRecrut=dateRecrut;
    this.employee.dateDepart=dateDepart;
    this.employee.numTel=this.addEmployeeForm.value.NumTel;
    this.employee.nomUrgence=this.addEmployeeForm.value.NomURG;
    this.employee.numUrgence=this.addEmployeeForm.value.TelURG;
    this.employee.relationUrgence=this.addEmployeeForm.value.RelationURG;
    this.employee.numPasseport=this.addEmployeeForm.value.NumPasseport;
    this.employee.dateExpPasseport=dateExpPasseport;
    this.employee.numCin=this.addEmployeeForm.value.CIN;
    this.employee.delivDate=dateDelivCIN;
    this.employee.civilite=this.addEmployeeForm.value.Civilite;
    this.employee.situationFam=this.addEmployeeForm.value.SituationFam;
    this.employee.nbEnfant=this.addEmployeeForm.value.NbEnfant;
    this.employee.salaireBrute=this.addEmployeeForm.value.Salaire;
    this.employee.cnss=this.addEmployeeForm.value.CNSS;
    this.employee.matriculeCnss=this.addEmployeeForm.value.MatriculeCNSS;
    this.employee.bankName=this.addEmployeeForm.value.BankName;
    this.employee.swift=this.addEmployeeForm.value.SWIFT;
    this.employee.rib=this.addEmployeeForm.value.RIB;
    this.employee.iban=this.addEmployeeForm.value.IBAN;
    this.employee.enConge=this.addEmployeeForm.value.EnConge;
    if(this.addEmployeeForm.value.Pole){
      this.srvModuleService.add(this.employee,`Employee/addEmployee?posteId=${this.addEmployeeForm.value.Poste.id}&poleId=${this.addEmployeeForm.value.Pole.id}`).
      subscribe((data) => 
      {this.loadEmployee();}
    );
    }else{
      this.srvModuleService.add(this.employee,`Employee/addEmployee?posteId=${this.addEmployeeForm.value.Poste.id}&poleId=${0}`).
      subscribe((data) => 
      {this.loadEmployee();}
    );
    }
    $("#add_employee").modal("hide");
    this.addEmployeeForm.reset();
    this.toastr.success("Employeee added sucessfully...!", "Success");
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
    this.employee.id=this.editId;
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
    this.srvModuleService.update(this.employee,'Employee/editEmployee').subscribe((data1) => {
      this.loadEmployee();
    });
    $("#edit_employee").modal("hide");
    this.toastr.success("Employeee Updated sucessfully...!", "Success");
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  editEmp(value) {
    this.editId = value;
    const index = this.employees.findIndex((item) => {
      return item.id === value;
    });
    
    let toSetValues:Employee = this.employees[index];
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
      Image: toSetValues.image,

    });
  }

  // edit update data set
 /* public edit(value: any) {
    let data = this.lstEmployee.filter((client) => client.id === value);
    this.editEmployeeForm.setValue({
      FirstName: data[0].firstname,
      LastName: data[0].lastname,
      UserName: data[0].username,
      Email: data[0].email,
      Password: data[0].password,
      ConfirmPassword: data[0].confirmpassword,
      EmployeeID: data[0].employeeId,
      JoinDate: data[0].joindate,
      PhoneNumber: data[0].phone,
      CompanyName: data[0].company,
      DepartmentName: data[0].department,
      Designation: data[0].designation,
      Id: data[0].id,
    });
  }*/

  // delete api call
  deleteEmployee() {
    this.srvModuleService.delete(this.tempId,'Employee/deleteEmployee').subscribe((data) => {
      this.loadEmployee();
      $("#delete_employee").modal("hide");
      this.toastr.success("Employee deleted sucessfully..!", "Success");
    });
  }

  //search by name
  searchEmployee(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.nom.toLowerCase().indexOf(val) !== -1 
      || d.prenom.toLowerCase().indexOf(val) !== -1 
      || !val;
    });
    this.rows.push(...temp);
  }

  //getting the status value
  getStatus(data) {
    this.statusValue = data;
  }
}
