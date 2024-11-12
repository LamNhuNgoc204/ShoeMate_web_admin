import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { Navigate } from 'react-router-dom';

// Loadable component cho các view
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const QlKH = Loadable(lazy(() => import('views/products/Customer')));
const Qltonkho = Loadable(lazy(() => import('views/products/Warehouse')));
const Qlgiamgia = Loadable(lazy(() => import('views/products/Discount')));
const Orders = Loadable(lazy(() => import('views/order/Orders')));
const Shipping = Loadable(lazy(() => import('views/order/Shipping')));
const User = Loadable(lazy(() => import('views/users/User')));
const Reviews = Loadable(lazy(() => import('views/users/Reviews')));
const AccountSettings = Loadable(lazy(() => import('views/handle/UpdateInfor')));

// ==============================|| MAIN ROUTING ||============================== //
// const isAuthenticated = false;

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    // {
    //   path: '/',
    //   element: isAuthenticated ? <DashboardDefault /> : <Navigate to="/pages/login/login3" />
    // },
    // {
    //   path: 'dashboard',
    //   element: isAuthenticated ? <DashboardDefault /> : <Navigate to="/pages/login/login3" />
    // },
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'sanpham',
      children: [
        {
          path: 'qlkh',
          element: <QlKH />
        },
        {
          path: 'qltonkho',
          element: <Qltonkho />
        },
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
        },
        {
          path: 'qldanhgia',
          element: <Reviews />
        }
      ]
    },
    {
      path: 'update-profile',
      element: <AccountSettings />
    }
  ]
};

export default MainRoutes;
