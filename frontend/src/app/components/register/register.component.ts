import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  regForm: FormGroup;
  selectedFile: File | null = null;
  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {
    this.regForm = new FormGroup({
      type: new FormControl('', [Validators.required]),
      breed: new FormControl('', [Validators.required]),
      milk: new FormControl('', [Validators.required]),
      child: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.regForm.invalid || !this.selectedFile) {
      console.error('Form is invalid or no file selected');
      return;
    }

    const formData = new FormData();
    formData.append('type', this.regForm.get('type')?.value);
    formData.append('breed', this.regForm.get('breed')?.value);
    formData.append('milk', this.regForm.get('milk')?.value);
    formData.append('child', this.regForm.get('child')?.value);
    formData.append('age', this.regForm.get('age')?.value);
    formData.append('price', this.regForm.get('price')?.value);
    formData.append('description', this.regForm.get('description')?.value);
    formData.append('animalImg', this.selectedFile);

    this.http.post(`${this.apiUrl}create-animal`, formData).subscribe({
      next: (response) => {
        console.log('Animal added successfully:', response);
        this.regForm.reset();
        this.selectedFile = null;
        alert('Animal added successfully!');
      },
      error: (error) => console.error('Error adding animal:', error),
    });
  }
}
