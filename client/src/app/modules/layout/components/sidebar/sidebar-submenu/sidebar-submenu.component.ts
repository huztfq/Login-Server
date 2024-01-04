import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { SubMenuItem } from 'src/app/core/models/menu.model';
import { MenuService } from '../../../services/menu.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
    selector: 'app-sidebar-submenu',
    templateUrl: './sidebar-submenu.component.html',
    styleUrls: ['./sidebar-submenu.component.scss'],
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarSubmenuComponent implements OnInit {
  @Input() public declare submenu: SubMenuItem | undefined;
  public declare filteredSubmenu: SubMenuItem | undefined;
  public leaveRequestsCount = 0;

  constructor(public menuService: MenuService, private authService: AuthService) {}

  ngOnInit(): void {
    this.filteredSubmenu = JSON.parse(JSON.stringify(this.submenu));
    this.filteredSubmenu!.children = this.submenu?.children?.filter(item => item.access === this.authService.getUserRole());
    this.menuService.leaveRequests.subscribe(res => {
      this.leaveRequestsCount = res;
    })
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
}
