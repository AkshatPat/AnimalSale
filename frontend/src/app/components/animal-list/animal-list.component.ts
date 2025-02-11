import { Component, OnInit } from '@angular/core';
import { AnimalService } from 'src/app/services/animal.service';

@Component({
  selector: 'app-animal-list',
  templateUrl: './animal-list.component.html',
  styleUrls: ['./animal-list.component.scss']
})
export class AnimalListComponent implements OnInit{

  animalsList: any[] = [];
  baseUrl = "http://localhost:3000/";
  
  constructor(private animalServ: AnimalService){}
  
  ngOnInit(): void {
    this.loadAllAnimals();
  }
  
  loadAllAnimals(){
    this.animalServ.getAllAnimals().subscribe((result: any)=>{
      this.animalsList = result.data;
      console.log(this.animalsList, "Animals list");
    })
  }
  
  type: string = '';
  animals: any[] = [];
  error: any;

  searchAnimals(): void {
    if (!this.type) {
      console.error('Type is required to search animals');
      return; 
    }

    this.animalServ.searchAnimalsByType(this.type).subscribe({
      next: (response) => {
        if (response.status) {
          this.animalsList = response.data;
          console.log('Animals fetched successfully:', this.animalsList);
        } else {
          
          console.error('Error fetching animals:', response.message);
        }
      },
      error: (err) => console.error('API error:', err),
    });
  }

  onTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.type = target.value;
    this.searchAnimals();
  }
  
}

