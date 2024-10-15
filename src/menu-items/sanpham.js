// assets
import { IconFolders, IconPackages, IconShoppingCartDiscount } from '@tabler/icons-react';

// constant
const icons = {
  IconFolders,
  IconPackages,
  IconShoppingCartDiscount
};

const utilities = {
  id: 'utilities',
  title: 'Sản phẩm',
  type: 'group',
  children: [
    {
      id: 'qlkh',
      title: 'Hỗ trợ khách hàng',
      type: 'item',
      url: '/sanpham/qlkh',
      icon: icons.IconFolders,
      breadcrumbs: false
    },
    {
      id: 'qltonkho',
      title: 'Quản lý kho hàng',
      type: 'item',
      url: '/sanpham/qltonkho',
      icon: icons.IconPackages,
      breadcrumbs: false
    },
    {
      id: 'qlkhuyenmai',
      title: 'Quản lý khuyến mãi',
      type: 'item',
      url: '/sanpham/qlkhuyenmai',
      icon: icons.IconShoppingCartDiscount,
      breadcrumbs: false
    }
  ]
};

export default utilities;
