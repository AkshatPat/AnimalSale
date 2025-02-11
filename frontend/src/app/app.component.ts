import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private http: HttpClient) {}

  register(event: Event) {
    event.preventDefault();
    this.router.navigate(['register']);
  }
  dashboard(event: Event) {
    event.preventDefault();
    this.router.navigate(['home']);
  }
}
