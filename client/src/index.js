import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './user/register';
import Login from './user/login';
import './index.css'
import { NotFound } from './user/notFoundPage';
import Post from './app/post';

const router = createBrowserRouter([
  {
    path: '/register',
    element: <Register />,
    errorElement: <div>404 not found</div>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Post />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)