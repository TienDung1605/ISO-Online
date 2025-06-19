import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrossScriptComponent } from './gross-script.component';

describe('GrossScriptComponent', () => {
  let component: GrossScriptComponent;
  let fixture: ComponentFixture<GrossScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrossScriptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrossScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
