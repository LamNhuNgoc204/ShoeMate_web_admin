import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// utilities routing
const Qlsp = Loadable(lazy(() => import('views/products/Products')));
const Qltonkho = Loadable(lazy(() => import('views/products/Warehouse')));
const Qlgiamgia = Loadable(lazy(() => import('views/products/Discount')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const Orders = Loadable(lazy(() => import('views/order/Orders')));
const Shipping = Loadable(lazy(() => import('views/order/Shipping')));

// User  page routing
const User = Loadable(lazy(() => import('views/users/User')));
const Reviews = Loadable(lazy(() => import('views/users/Reviews')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sanpham',
      children: [
        {
          path: 'qlsp',
          element: <Qlsp />
        }
      ]
    },
    {
      path: 'sanpham',
      children: [
        {
          path: 'qltonkho',
          element: <Qltonkho />
        }
      ]
    },
    {
      path: 'sanpham',
      children: [
        {
          path: 'qlkhuyenmai',
          element: <Qlgiamgia />
        }
      ]
    },
    {
      path: 'donhang',
      children: [
        {
          path: 'qldonhang',
          element: <Orders />
        },
        {
          path: 'qlvanchuyen',
          element: <Shipping />
        }
      ]
    },
    {
      path: 'user',
      children: [
        {
          path: 'qlkh',
          element: <User />
        }
      ]
    },
    {
      path: 'user',
      children: [
        {
          path: 'qldanhgia',
          element: <Reviews />
        }
      ]
    },
  ]
};

export default MainRoutes;
