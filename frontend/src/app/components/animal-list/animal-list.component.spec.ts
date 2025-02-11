// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { AnimalListComponent } from './animal-list.component';
// import { AnimalService } from 'src/app/services/animal.service';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// describe('AnimalListComponent', () => {
//   let component: AnimalListComponent;
//   let fixture: ComponentFixture<AnimalListComponent>;
//   let animalService: AnimalService;
//   let httpTestingController: HttpTestingController;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [AnimalListComponent],
//       imports: [HttpClientTestingModule],
//       providers: [AnimalService],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents();

//     animalService = TestBed.inject(AnimalService);
//     httpTestingController = TestBed.inject(HttpTestingController);
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AnimalListComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   afterEach(() => {
//     httpTestingController.verify(); // Ensure no outstanding HTTP requests
//   });

//   it('should create the AnimalListComponent', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should call loadAllAnimals on ngOnInit and load animals from the API', () => {
//     const mockAnimals = [
//       { type: 'dog', price: 300 },
//       { type: 'cat', price: 200 },
//     ];

//     component.ngOnInit();

//     const req = httpTestingController.expectOne('http://localhost:3000/api/animals-list');
//     expect(req.request.method).toBe('GET');
//     req.flush(mockAnimals);

//     expect(component.animalsList).toEqual(mockAnimals);
//   });

//   it('should handle API error when loading animals', () => {
//     component.ngOnInit();

//     const req = httpTestingController.expectOne('http://localhost:3000/api/animals-list');
//     req.error(new ErrorEvent('Network error'));

//     expect(component.animalsList).toEqual([]);
//   });

//   it('should call searchAnimals and update animals list on type change', () => {
//     const mockResponse = { status: true, data: [{ type: 'Cow', price: 50000 }] };

//     component.type = 'Cow';
//     component.searchAnimals();

//     const req = httpTestingController.expectOne('http://localhost:3000/api/search-animal');
//     expect(req.request.method).toBe('POST');
//     expect(req.request.body).toEqual({ type: 'Cow' });
//     req.flush(mockResponse);

//     expect(component.animalsList).toEqual(mockResponse.data);
//   });

//   it('should log error if type is not selected when searching animals', () => {
//     spyOn(console, 'error');

//     component.type = ''; // No type selected
//     component.searchAnimals();

//     expect(console.error).toHaveBeenCalledWith('Type is required to search animals');
//   });

//   it('should handle error in searchAnimals on API failure', () => {
//     spyOn(console, 'error');
//     const mockError = { message: 'Error fetching animals' };

//     component.type = 'Cow';
//     component.searchAnimals();

//     const req = httpTestingController.expectOne('http://localhost:3000/api/search-animal');
//     req.error(new ErrorEvent('Network error'));

//     expect(console.error).toHaveBeenCalledWith('API error:', jasmine.anything());
//   });
// });












import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimalListComponent } from './animal-list.component';
import { AnimalService } from 'src/app/services/animal.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('AnimalListComponent', () => {
  let component: AnimalListComponent;
  let fixture: ComponentFixture<AnimalListComponent>;
  let animalService: jasmine.SpyObj<AnimalService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const animalServiceSpy = jasmine.createSpyObj('AnimalService', [
      'getAllAnimals',
      'searchAnimalsByType',
    ]);

    await TestBed.configureTestingModule({
      declarations: [AnimalListComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: AnimalService, useValue: animalServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalListComponent);
    component = fixture.componentInstance;
    animalService = TestBed.inject(AnimalService) as jasmine.SpyObj<AnimalService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load all animals on initialization', () => {
    const mockAnimals: any[] = [
      { type: 'Cow', milk: 5, age: 3, price: 5000, child: 2, description: 'Healthy', animalImg: 'cow.jpg' },
      { type: 'Buffalo', milk: 8, age: 4, price: 6000, child: 1, description: 'Strong', animalImg: 'buffalo.jpg' },
    ];

    animalService.getAllAnimals.and.returnValue(of({ data: mockAnimals }));
    component.ngOnInit();

    expect(animalService.getAllAnimals).toHaveBeenCalled();
    expect(component.animalsList).toEqual(mockAnimals);
  });

//   it('should log an error when loading all animals fails', () => {
//     spyOn(console, 'error');
//     animalService.getAllAnimals.and.returnValue(throwError('API error'));
//     component.ngOnInit();

//     expect(animalService.getAllAnimals).toHaveBeenCalled();
//     expect(console.error).toHaveBeenCalledWith('API error');
//     expect(component.animalsList).toEqual([]);
//   });

  it('should fetch animals by type when a valid type is selected', () => {
    const mockAnimals = [
      { type: 'Cow', milk: 5, age: 3, price: 5000, child: 2, description: 'Healthy', animalImg: 'cow.jpg' },
    ];

    animalService.searchAnimalsByType.and.returnValue(of({ status: true, data: mockAnimals }));
    component.type = 'Cow';
    component.searchAnimals();

    expect(animalService.searchAnimalsByType).toHaveBeenCalledWith('Cow');
    expect(component.animalsList).toEqual(mockAnimals);
  });

  it('should log an error if the type is not selected before searching', () => {
    spyOn(console, 'error');
    component.type = '';
    component.searchAnimals();

    expect(console.error).toHaveBeenCalledWith('Type is required to search animals');
    expect(animalService.searchAnimalsByType).not.toHaveBeenCalled();
  });

//   it('should log an error if fetching animals by type fails', () => {
//     spyOn(console, 'error');
//     animalService.searchAnimalsByType.and.returnValue(throwError('API error'));
//     component.type = 'Cow';
//     component.searchAnimals();

//     expect(console.error).toHaveBeenCalledWith('API error');
//     expect(component.animalsList).toEqual([]);
//   });

  it('should update the type when the dropdown changes and trigger a search', () => {
    const mockAnimals = [
      { type: 'Cow', milk: 5, age: 3, price: 5000, child: 2, description: 'Healthy', animalImg: 'cow.jpg' },
    ];

    animalService.searchAnimalsByType.and.returnValue(of({ status: true, data: mockAnimals }));
    const dropdown = fixture.debugElement.query(By.css('select'));
    dropdown.triggerEventHandler('change', { target: { value: 'Cow' } });

    expect(component.type).toBe('Cow');
    expect(animalService.searchAnimalsByType).toHaveBeenCalledWith('Cow');
    expect(component.animalsList).toEqual(mockAnimals);
  });

//   it('should display animals in the list', () => {
//     const mockAnimals = [
//       { type: 'Cow', milk: 5, age: 3, price: 5000, child: 2, description: 'Healthy', animalImg: 'cow.jpg' },
//       { type: 'Buffalo', milk: 8, age: 4, price: 6000, child: 1, description: 'Strong', animalImg: 'buffalo.jpg' },
//     ];

//     component.animalsList = mockAnimals;
//     fixture.detectChanges();

//     const animalCards = fixture.debugElement.queryAll(By.css('.card'));
//     expect(animalCards.length).toBe(mockAnimals.length);

//     const firstAnimalTitle = animalCards[0].query(By.css('.card-title')).nativeElement.textContent.trim();
//     expect(firstAnimalTitle).toBe('Cow');
//   });

//   it('should display a message if no animals are found', () => {
//     component.animalsList = [];
//     fixture.detectChanges();

//     const message = fixture.debugElement.query(By.css('.text-center p')).nativeElement.textContent.trim();
//     expect(message).toBe('No animals found for the selected type.');
//   });
});
