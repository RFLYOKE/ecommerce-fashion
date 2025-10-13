export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href: string;
  badge?: string;
  children?: MenuItem[];
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}