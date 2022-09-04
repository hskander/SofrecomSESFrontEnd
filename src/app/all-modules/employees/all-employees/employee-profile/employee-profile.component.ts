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
declare const $: any;

@Component({
  selector: "app-employee-profile",
  templateUrl: "./employee-profile.component.html",
  styleUrls: ["./employee-profile.component.css"],
})
export class EmployeeProfileComponent implements OnInit {
  
  public dtElement: DataTableDirective;
  public editId: any;
  public addEmployeeForm: FormGroup;
  public editEmployeeForm: FormGroup;
  public employee : Employee;
  public experience : Experience[]=[];
  public emp : any;
  public poles : Pole[] = [];
  public diplomeDetails : DiplomeDetails[] = [];
  public empId:any;
  public poleManager:Employee = $;
  public pole:Pole;
  public directionManager:Employee = $;
  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private allModulesService: AllModulesService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
  this.getEmp();
  this.getEmployePole();
  this.getDirectionManager();
  this.getPoles();
  this.getExperience();
  }
    // Get pole list  Api Call
    getPoles(): void {
      this.allModulesService.get('Pole/all').subscribe(
        (response: Pole[]) => {
          this.poles= response;
         // console.log(this.poles);
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
              console.log(this.directionManager.prenom);
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        }
    // Get Employee By ID list  Api Call
  getEmp(): void {
    this.allModulesService.getOne(`Employee/find?id=${this.route.snapshot.params.id}`).subscribe(
      (response: Employee) => {
        this.employee= response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }



  onSubmit() {
    this.toastr.success("Bank & statutory added", "Success");
  }
}
