import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty controls', () => {
    const form = component.regForm;
    expect(form).toBeTruthy();
    expect(form.get('type')?.value).toBe('');
    expect(form.get('breed')?.value).toBe('');
    expect(form.get('milk')?.value).toBe('');
    expect(form.get('child')?.value).toBe('');
    expect(form.get('age')?.value).toBe('');
    expect(form.get('price')?.value).toBe('');
    expect(form.get('description')?.value).toBe('');
  });

  it('should mark the form as invalid if controls are empty', () => {
    expect(component.regForm.valid).toBeFalse();
  });

  it('should validate form control "type" as required', () => {
    const typeControl = component.regForm.get('type');
    typeControl?.setValue('');
    expect(typeControl?.valid).toBeFalse();
    typeControl?.setValue('Cow');
    expect(typeControl?.valid).toBeTrue();
  });

  it('should set selectedFile on file selection', () => {
    const file = new File(['dummy content'], 'animal.jpg', { type: 'image/jpeg' });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as Event;

    component.onFileSelect(event);
    expect(component.selectedFile).toBe(file);
  });

  it('should not submit the form if it is invalid', () => {
    spyOn(console, 'error');
    component.onSubmit();
    expect(console.error).toHaveBeenCalledWith('Form is invalid or no file selected');
  });

  it('should send HTTP POST request on valid form submission', () => {
    const mockResponse = { message: 'Animal created successfully' };
    const file = new File(['dummy content'], 'animal.jpg', { type: 'image/jpeg' });

    component.regForm.patchValue({
      type: 'Cow',
      breed: 'Gir',
      milk: '5',
      child: '2',
      age: '3',
      price: '5000',
      description: 'Healthy cow',
    });
    component.selectedFile = file;

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:3000/api/create-animal');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();

    const formData = req.request.body as FormData;
    expect(formData.get('type')).toBe('Cow');
    expect(formData.get('breed')).toBe('Gir');
    expect(formData.get('milk')).toBe('5');
    expect(formData.get('child')).toBe('2');
    expect(formData.get('age')).toBe('3');
    expect(formData.get('price')).toBe('5000');
    expect(formData.get('description')).toBe('Healthy cow');
    expect(formData.get('animalImg')).toBe(file);

    req.flush(mockResponse);
  });

  it('should reset the form and selectedFile after successful submission', () => {
    const file = new File(['dummy content'], 'animal.jpg', { type: 'image/jpeg' });

    component.regForm.patchValue({
      type: 'Cow',
      breed: 'Gir',
      milk: '5',
      child: '2',
      age: '3',
      price: '5000',
      description: 'Healthy cow',
    });
    component.selectedFile = file;

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:3000/api/create-animal');
    req.flush({ message: 'Animal created successfully' });

    expect(component.regForm.valid).toBeFalse();
    expect(component.selectedFile).toBeNull();
  });

  it('should handle error on form submission', () => {
    spyOn(console, 'error');
    const file = new File(['dummy content'], 'animal.jpg', { type: 'image/jpeg' });

    component.regForm.patchValue({
      type: 'Cow',
      breed: 'Gir',
      milk: '5',
      child: '2',
      age: '3',
      price: '5000',
      description: 'Healthy cow',
    });
    component.selectedFile = file;

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:3000/api/create-animal');
    req.flush({ message: 'Error occurred' }, { status: 500, statusText: 'Server Error' });

    expect(console.error).toHaveBeenCalledWith('Error adding animal:', jasmine.any(Object));
  });
});
