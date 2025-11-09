import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  return (
    <div>
      <Header />
      <main className="p-0">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;