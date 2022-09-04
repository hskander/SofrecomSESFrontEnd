import { Component, OnInit } from "@angular/core";
import { AllModulesService } from 'src/app/all-modules/all-modules.service';
import { Employee } from 'src/models/employee';
import { Direction } from 'src/models/direction';
import { Pole } from 'src/models/pole';
@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  public chartData;
  public chartOptions;
  public lineData;
  public lineOption;
  public barColors = {
    a: "#ff9b44",
    b: "#fc6075",
  };
  public lineColors = {
    a: "#ff9b44",
    b: "#fc6075",
  };

  employees: Employee[]=[];
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
    };

    this.chartData = [
      { y: "2006", a: 100, b: 90 },
      { y: "2007", a: 75, b: 65 },
      { y: "2008", a: 50, b: 40 },
      { y: "2009", a: 75, b: 65 },
      { y: "2010", a: 50, b: 40 },
      { y: "2011", a: 75, b: 65 },
      { y: "2012", a: 100, b: 90 },
      { y: "2013", a: 65, b: 70 },
      { y: "2014", a: 50, b: 40 },
    ];

    this.lineOption = {
      xkey: "y",
      ykeys: ["a", "b"],
      labels: ["Total Sales", "Total Revenue"],
      resize: true,
      lineColors: [this.lineColors.a, this.lineColors.b],
    };

    this.lineData = [
      { y: '2006', a: 50, b: 90 },
      { y: '2007', a: 75,  b: 65 },
      { y: '2008', a: 50,  b: 40 },
      { y: '2009', a: 75,  b: 65 },
      { y: '2010', a: 50,  b: 40 },
      { y: '2011', a: 75,  b: 65 },
      { y: '2012', a: 100, b: 50 }
    ];
  }

  loadEmployee() {
    this.srvModuleService.get('Employee/allEmployees').subscribe((data) => {
      this.employees = data;
    });
  }
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
