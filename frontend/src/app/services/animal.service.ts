import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  private apiUrl = 'http://localhost:3000/api/';
  constructor(private http: HttpClient) { }

  getAllAnimals():Observable<{data: any[]}>{
    return this.http.get<{data: any[]}>(`${this.apiUrl}animals-list`);
  }

  searchAnimalsByType(type: string): Observable<any> {
    return this.http.post(`${this.apiUrl}search-animal`, { type });
  }
}
