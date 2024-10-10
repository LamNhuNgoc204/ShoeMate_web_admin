// assets
import { IconHome } from '@tabler/icons-react';

// constant
const icons = { IconHome };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Bảng điều khiển',
      type: 'item',
      url: '/dashboard',
      icon: icons.IconHome,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
