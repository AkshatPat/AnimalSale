// import { TestBed } from '@angular/core/testing';

// import { AnimalService } from './animal.service';

// describe('AnimalService', () => {
//   let service: AnimalService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(AnimalService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });



import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnimalService } from './animal.service';

describe('AnimalService', () => {
  let service: AnimalService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/api/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnimalService]
    });
    service = TestBed.inject(AnimalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getAllAnimals', () => {
    it('should fetch a list of animals', () => {
      const mockResponse = {
        data: [
          { type: 'Cow', milk: 5, age: 3, price: 5000, child: 2, description: 'Healthy', animalImg: 'cow.jpg' },
          { type: 'Buffalo', milk: 8, age: 4, price: 6000, child: 1, description: 'Strong', animalImg: 'buffalo.jpg' }
        ]
      };

      service.getAllAnimals().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.data.length).toBe(2);
        expect(response.data[0].type).toBe('Cow');
      });

      const req = httpMock.expectOne(`${apiUrl}animals-list`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('#searchAnimalsByType', () => {
    it('should search for animals by type', () => {
      const mockType = 'Cow';
      const mockResponse = {
        status: true,
        data: [
          { type: 'Cow', milk: 5, age: 3, price: 5000, child: 2, description: 'Healthy', animalImg: 'cow.jpg' }
        ]
      };

      service.searchAnimalsByType(mockType).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.data.length).toBe(1);
        expect(response.data[0].type).toBe('Cow');
      });

      const req = httpMock.expectOne(`${apiUrl}search-animal`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ type: mockType });
      req.flush(mockResponse);
    });
  });
});

