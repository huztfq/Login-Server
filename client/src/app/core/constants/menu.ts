import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Dashboard',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Dashboard',
          route: '/dashboard',
          children: [
            { label: 'View Employees', route: '/dashboard/home', access: 'admin' },
            { label: 'Add New Employee', route: '/dashboard/add-employee', access: 'admin' },
            { label: 'View Paid Time Off', route: '/dashboard/view-pto', access: 'employee' },
          ],
        }
      ],
    },  
  ];
}
