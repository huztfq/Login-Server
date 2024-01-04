export interface MenuItem {
  group: string;
  separator?: boolean;
  selected?: boolean;
  active?: boolean;
  items: Array<SubMenuItem>;
}

export interface SubMenuItem {
  icon?: string;
  label?: string;
  route?: string | null;
  access?: 'admin' | 'employee',
  expanded?: boolean;
  active?: boolean;
  children?: Array<SubMenuItem>;
  badge?: boolean;
}
