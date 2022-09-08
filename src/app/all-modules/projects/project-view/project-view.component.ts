import { Component, OnInit } from "@angular/core";
import { AllModulesService } from "../../all-modules.service";
import { ActivatedRoute } from "@angular/router";
import { map, mergeMap } from "rxjs/operators";
import {Projet } from 'src/models/projet';
import { HttpErrorResponse } from '@angular/common/http';
declare const $: any;
@Component({
  selector: "app-project-view",
  templateUrl: "./project-view.component.html",
  styleUrls: ["./project-view.component.css"],
})
export class ProjectViewComponent implements OnInit {
  public projects = [];
  public projectId: any;
  public project: any;
  public projectDescription ;
  public projectTitle;
  public projectStart;
  public projectEnd;
  public projets: Projet[]=[];
  public projet: Projet = $;
  public Project;
  

  constructor(
    private allModulesService: AllModulesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
   this.getProjet()
  }

      // Get Project By ID list  Api Call
    getProjet(): void {
        this.allModulesService.getOne(`Projet/findProjetById?id=${this.route.snapshot.params.id}`).subscribe(
          (response: Projet) => {
            this.projet= response;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
}