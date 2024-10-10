// assets
import { IconAlignBoxBottomRight, IconTruck } from '@tabler/icons-react';

// constant
const icons = { IconAlignBoxBottomRight, IconTruck };

const order = {
  id: 'order',
  title: 'Quản lý đơn hàng',
  type: 'group',
  children: [
    {
      id: 'donhang',
      title: 'Đơn hàng',
      type: 'item',
      url: 'donhang/qldonhang',
      icon: icons.IconAlignBoxBottomRight,
      breadcrumbs: false
    },
    {
      id: 'shipping',
      title: 'Vận chuyển',
      type: 'item',
      url: 'donhang/qlvanchuyen',
      icon: icons.IconTruck,
      external: false,
      target: false
    }
  ]
};

export default order;
