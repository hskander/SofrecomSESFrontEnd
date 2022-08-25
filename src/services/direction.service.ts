import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Direction } from 'src/models/direction';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class DirectionService {
  private apiServerUrl = environment.apiBaseUrl;
  private handleError(error: any) {
    return throwError(error);
  }
  // Headers Setup
  headers = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");
  httpOptions = {
    headers: this.headers,
  };
  constructor(private http: HttpClient) { }

  public getDirections(): Observable<Direction[]>{
    return this.http.get<Direction[]>(this.apiServerUrl+'/Direction/all').pipe(
      map((response:Direction[])=>{
        return response as Direction[];
      })
    )
  }

  public addDirection(direction:Direction):Observable<Direction>{
    return this.http.post<Direction>(this.apiServerUrl+'/Direction/addDirection',direction);
  }
  add(direction: Direction): Observable<any> {
    return this.http
      .post<Direction>(this.apiServerUrl+'/Direction/addDirection', direction, this.httpOptions)
      .pipe(tap(), catchError(this.handleError));
  }

  public updateDirection(direction:Direction):Observable<Direction>{
    return this.http.put<Direction>(this.apiServerUrl+'/Direction/editDirection',direction);
  }

  public deleteDirection(directionId:number):Observable<Direction>{
    return this.http.delete<Direction>(this.apiServerUrl+'/Direction/deleteDirection?id='+directionId);
  }
}
