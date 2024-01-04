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
            { label: 'Attendance', route: '/dashboard/view-pto', access: 'employee' },
            { label: 'Request Leave', route: '/dashboard/request', access: 'employee' },
            { label: 'Leave Requests', route: '/dashboard/view-requests', access: 'admin', badge: true },
            { label: 'Leave Request History', route: '/dashboard/view-history', access: 'admin' },
            { label: 'Edit Employee', route: '/dashboard/edit-employee', access: 'admin' },
          ],
        }
      ],
    },  
  ];
}
