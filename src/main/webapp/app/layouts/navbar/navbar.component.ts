import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/config/language.constants';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import ActiveMenuDirective from './active-menu.directive';
import NavbarItem from './navbar-item.model';
import MainComponent from '../main/main.component';

@Component({
  standalone: true,
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule, SharedModule, HasAnyAuthorityDirective, ActiveMenuDirective],
})
export default class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = signal(true);
  languages = LANGUAGES;
  openAPIEnabled?: boolean;
  version = '';
  account = inject(AccountService).trackCurrentAccount();
  entitiesNavbarItems: NavbarItem[] = [];
  showLogo = 'false';

  private loginService = inject(LoginService);
  private translateService = inject(TranslateService);
  private stateStorageService = inject(StateStorageService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  constructor(private mainComponent: MainComponent) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.toggleSidebar2()
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });
  }

  changeLanguage(languageKey: string): void {
    this.stateStorageService.storeLocale(languageKey);
    this.translateService.use(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed.set(true);
  }

  login(): void {
    this.loginService.login();
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed.update(isNavbarCollapsed => !isNavbarCollapsed);
  }

  toggleSidebar(): void {
    const isSidebarCollapsed = sessionStorage.getItem('toggleSidebar');
    this.showLogo = sessionStorage.getItem('showLogo')!;
    if (isSidebarCollapsed === 'open') {
      this.mainComponent.closeNav();
      document.getElementById('sidebar-id')!.style.width = '67px';
      document.getElementById('navbar-nav')!.style.width = '56px';
      sessionStorage.setItem('showLogo', 'hide');
      sessionStorage.setItem('toggleSidebar', 'close');
    }
    if (isSidebarCollapsed === 'close') {
      this.mainComponent.openNav();
      document.getElementById('sidebar-id')!.style.width = '250px';
      document.getElementById('navbar-nav')!.style.width = '239px';
      sessionStorage.setItem('showLogo', 'show');
      sessionStorage.setItem('toggleSidebar', 'open');
    }
  }

  toggleSidebar2(): void {
    this.showLogo = 'hide';
    document.getElementById('sidebar-id')!.style.width = '67px';
    document.getElementById('navbar-nav')!.style.width = '56px';
    this.mainComponent.closeNav2();
    sessionStorage.setItem('toggleSidebar', 'close');
    sessionStorage.setItem('showLogo', 'show');
  }
}
