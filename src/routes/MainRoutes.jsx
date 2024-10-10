import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { Navigate } from 'react-router-dom';

// Loadable component cho các view
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const Qlsp = Loadable(lazy(() => import('views/products/Products')));
const Qltonkho = Loadable(lazy(() => import('views/products/Warehouse')));
const Qlgiamgia = Loadable(lazy(() => import('views/products/Discount')));
const Orders = Loadable(lazy(() => import('views/order/Orders')));
const Shipping = Loadable(lazy(() => import('views/order/Shipping')));
const User = Loadable(lazy(() => import('views/users/User')));
const Reviews = Loadable(lazy(() => import('views/users/Reviews')));

// ==============================|| MAIN ROUTING ||============================== //
const isAuthenticated = false;

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: isAuthenticated ? <DashboardDefault /> : <Navigate to="/pages/login/login3" />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'sanpham',
      children: [
        {
          path: 'qlsp',
          element: <Qlsp />
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
    }
  ]
};

export default MainRoutes;
