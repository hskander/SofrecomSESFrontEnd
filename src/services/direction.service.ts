import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Direction } from 'src/models/direction';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class DirectionService {
  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) { }

  public getDirections(): Observable<Direction[]>{
    return this.http.get<Direction[]>(this.apiServerUrl+'/Direction/all').pipe(
      map((response:Direction[])=>{
        return response as Direction[];
      })
    )
  }

  public addEmployee(direction:Direction):Observable<Direction>{
    return this.http.post<Direction>(this.apiServerUrl+'/Direction/addDirection',direction);
  }

  public updateEmployee(direction:Direction):Observable<Direction>{
    return this.http.put<Direction>(this.apiServerUrl+'/Direction/editDirection',direction);
  }

  public deleteEmployee(directionId:number):Observable<Direction>{
    return this.http.delete<Direction>(this.apiServerUrl+'/Direction/deleteDirection?id='+directionId);
  }
}
