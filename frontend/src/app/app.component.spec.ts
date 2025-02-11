import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { AnimalListComponent } from './components/animal-list/animal-list.component';
import { RegisterComponent } from './components/register/register.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: AnimalListComponent },
          { path: 'register', component: RegisterComponent },
          { path: '**', component: AnimalListComponent },
        ]),
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });


  it('should navigate to home when clicking the "Home" link', async () => {
    const homeLink = fixture.debugElement.query(By.css('a.text-dark'));
    homeLink.triggerEventHandler('click', new MouseEvent('click'));
    await fixture.whenStable();
    expect(location.path()).toBe('/home');
  });

  it('should navigate to register when clicking the "Add Animal" button', async () => {
    const addAnimalButton = fixture.debugElement.query(By.css('.btn.btn-outline-success'));
    addAnimalButton.triggerEventHandler('click', new MouseEvent('click'));
    await fixture.whenStable(); 
    expect(location.path()).toBe('/register');
  });

  it('should display the footer with correct content', () => {
    const footer = fixture.debugElement.query(By.css('footer'));
    expect(footer.nativeElement.textContent).toContain('Copyright ©2024 All Rights Reserved');
  });

});

