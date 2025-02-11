import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/';
  constructor(private http: HttpClient) { }

  register(formObj: any): Observable<any>{
    return this.http.post(this.apiUrl+"create-animal", formObj, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
