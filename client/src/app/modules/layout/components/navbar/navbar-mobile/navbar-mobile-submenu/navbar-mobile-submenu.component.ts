import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MenuService } from 'src/app/modules/layout/services/menu.service';
import { SubMenuItem } from 'src/app/core/models/menu.model';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-navbar-mobile-submenu',
    templateUrl: './navbar-mobile-submenu.component.html',
    styleUrls: ['./navbar-mobile-submenu.component.scss'],
    standalone: true,
    imports: [
        NgClass,
        NgFor,
        NgIf,
        NgTemplateOutlet,
        RouterLinkActive,
        RouterLink,
        AngularSvgIconModule,
    ],
})
export class NavbarMobileSubmenuComponent implements OnInit {
  @Input() public submenu = <SubMenuItem>{};
  public leaveRequestsCount = 0;

  constructor(public menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.leaveRequests.subscribe(res => {
      this.leaveRequestsCount = res
    });
  }

  public toggleMenu(menu: any) {
    this.menuService.toggleSubMenu(menu);
  }

  private collapse(items: Array<any>) {
    items.forEach((item) => {
      item.expanded = false;
      if (item.children) this.collapse(item.children);
    });
  }

  public closeMobileMenu() {
    this.menuService.showMobileMenu = false;
  }
}
