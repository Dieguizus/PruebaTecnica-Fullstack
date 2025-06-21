import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Sidebar from './sidebar';
import '../../styles/layout.css';

const Layout = ({ children, showSidebar = true }) => {
  return (
    <div className="app-layout">
      <Header />
      
      <div className="layout-body">
        {showSidebar && <Sidebar />}
        
        <main className={`main-content ${!showSidebar ? 'full-width' : ''}`}>
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;