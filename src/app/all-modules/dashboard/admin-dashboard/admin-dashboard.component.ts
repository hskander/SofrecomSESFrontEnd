import { Component, OnInit } from "@angular/core";
import { AllModulesService } from 'src/app/all-modules/all-modules.service';
import { Employee } from 'src/models/employee';
import { Direction } from 'src/models/direction';
import { Pole } from 'src/models/pole';
import { ArrayDataSource } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  public chartData=[];
  public totalEmployees1: number[]=[];
  public totalEmployees2: number[]=[];
  public dtTrigger: Subject<any> = new Subject();
  public test : number;
  public table=[];
  public chartOptions;
  public lineData;
  public lineOption;
  public barColors = {
    a: "#ff9b44",
    b: "#fc6075",
  };
 
  employees: Employee[]=[];
  public pipe = new DatePipe("en-US");
  salariesHomme:Employee[]=[];
  salariesFemme:Employee[]=[];
  salariesCelibataire:Employee[]=[];
  salariesMarie:Employee[]=[];
  directions: Direction[]=[];
  poles: Pole[]=[];
  pourcentageHomme:number;
  pourcentageFemme:number;
  pourcentageCelibataire:number;
  pourcentageMarie:number;
  constructor(private srvModuleService: AllModulesService,) { }

  ngOnInit() {
    this.loadEmployee();
    this.loadPoles();
    this.loadDirections();
    this.findMales();
    this.findFemales();
    this.findCeliataires();
    this.findMaries();
    this.chartOptions = {
      xkey: "y",
      ykeys: ["a", "b"],
      labels: ["Total Income", "Total Outcome"],
      barColors: [this.barColors.a, this.barColors.b],
    }

    for (let i = 2011; i <= new Date().getFullYear(); i++){
      this.findEmployeByYearRecrut(i);
      this.findEmployeByYearDepart(i);
    }
  
   for (let i = 0 ; i <= 11; i++){
      this.chartData.push(
        { y: i+2011, a: this.totalEmployees1[i], b:  this.totalEmployees2[i] }
      )
    }
  
  }
  
  findEmployeByYearRecrut(year){
    this.srvModuleService.get(`Employee/findEmployeByYearRecrut?year=${year}`).subscribe((data:Employee[]) => {
     
      this.totalEmployees1.push(data.length);
       
       this.dtTrigger.next();
       console.log( this.totalEmployees1);
    });
  }
  findEmployeByYearDepart(year){
    this.srvModuleService.get(`Employee/findEmployeByYearDepart?year=${year}`).subscribe((data:Employee[]) => {
      this.totalEmployees2.push(data.length);
      this.dtTrigger.next();
       console.log( this.totalEmployees2);
    });
  }

  loadEmployee() {
    this.srvModuleService.get('Employee/allEmployees').subscribe((data) => {
      this.employees = data;
      this.loadAmateur();
      this.loadJunior1();
      this.loadJunior2();
      this.loadConfirme();
      this.loadSenior1();
      this.loadSenior2();
      this.loadSenior3();
    });
  }
  // Seniorité
  public amateursEmp:Employee[]=[];
  public junior1Emp:Employee[]=[];
  public junior2Emp:Employee[]=[];
  public confirmeEmp:Employee[]=[];
  public senior1Emp:Employee[]=[];
  public senior2Emp:Employee[]=[];
  public senior3Emp:Employee[]=[];
  loadAmateur(){
    for(let e of this.employees){
      let dateRecrut = this.pipe.transform(
        e.dateRecrut,
        "yyyy-MM-dd"
      );
      if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))<1 && !e.dateDepart){
        this.amateursEmp.push(e);
      }
    };
  }
  loadJunior1(){
    for(let e of this.employees){
      let dateRecrut = this.pipe.transform(
        e.dateRecrut,
        "yyyy-MM-dd"
      );
      if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))<2&&new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))>=1 && !e.dateDepart){
        this.junior1Emp.push(e);
      }
    };
  }
  loadJunior2(){
    for(let e of this.employees){
      let dateRecrut = this.pipe.transform(
        e.dateRecrut,
        "yyyy-MM-dd"
      );
      if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))<3&&new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))>=2 && !e.dateDepart){
        this.junior2Emp.push(e);
      }
    };
  }
  loadConfirme(){
    for(let e of this.employees){
      let dateRecrut = this.pipe.transform(
        e.dateRecrut,
        "yyyy-MM-dd"
      );
      if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))<5&&new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))>=3 && !e.dateDepart){
        this.confirmeEmp.push(e);
      }
    };
  }
  loadSenior1(){
    for(let e of this.employees){
      let dateRecrut = this.pipe.transform(
        e.dateRecrut,
        "yyyy-MM-dd"
      );
      if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))<7&&new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))>=5 && !e.dateDepart){
        this.senior1Emp.push(e);
      }
    };
  }
  loadSenior2(){
    for(let e of this.employees){
      let dateRecrut = this.pipe.transform(
        e.dateRecrut,
        "yyyy-MM-dd"
      );
      if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))<10&&new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))>=7 && !e.dateDepart){
        this.senior2Emp.push(e);
      }
    };
  }
  loadSenior3(){
    for(let e of this.employees){
      let dateRecrut = this.pipe.transform(
        e.dateRecrut,
        "yyyy-MM-dd"
      );
      if(new Date().getFullYear() - parseInt(dateRecrut.slice(0,4))>=10 && !e.dateDepart){
        this.senior3Emp.push(e);
      }
    };
  }
  // Seniorité
  loadDirections() {
    this.srvModuleService.get('Direction/all').subscribe((data) => {
      this.directions = data;
    });
  }
  loadPoles() {
    this.srvModuleService.get('Pole/all').subscribe((data) => {
      this.poles = data;
    });
  }
  findMales(){
    this.srvModuleService.get('Employee/findMales').subscribe((data) => {
      this.salariesHomme = data;
    this.pourcentageHomme=(this.salariesHomme.length/this.employees.length)*100;
    });
  }
  findFemales(){
    this.srvModuleService.get('Employee/findFemales').subscribe((data) => {
      this.salariesFemme = data;
    this.pourcentageFemme=(this.salariesFemme.length/this.employees.length)*100;
    });
  }
  findCeliataires(){
    this.srvModuleService.get('Employee/findCelibataire').subscribe((data) => {
      this.salariesCelibataire = data;
    this.pourcentageCelibataire=(this.salariesCelibataire.length/this.employees.length)*100;
    });
  }
  findMaries(){
    this.srvModuleService.get('Employee/findMarie').subscribe((data) => {
      this.salariesMarie = data;
    this.pourcentageMarie=(this.salariesMarie.length/this.employees.length)*100;
    });
  }
}
