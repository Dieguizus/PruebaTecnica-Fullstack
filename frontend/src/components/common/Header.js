import React from 'react';

const Header = ({ title = 'Somos Crédito', subtitle = 'Sistema de Gestión' }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-logo">
            <span className="logo-icon">🏢</span>
            <div className="brand-text">
              <h1 className="brand-title">{title}</h1>
              {subtitle && <p className="brand-subtitle">{subtitle}</p>}
            </div>
          </div>
        </div>

        <nav className="header-nav">
          <ul className="nav-menu">
            <li className="nav-item">
              <a href="#sucursales" className="nav-link active">
                <span className="nav-icon">🏢</span>
                Sucursales
              </a>
            </li>
            <li className="nav-item">
              <a href="#clientes" className="nav-link">
                <span className="nav-icon">👥</span>
                Clientes
              </a>
            </li>
            <li className="nav-item">
              <a href="#creditos" className="nav-link">
                <span className="nav-icon">💰</span>
                Créditos
              </a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <button className="btn btn-icon" title="Notificaciones">
            🔔
          </button>
          <div className="user-menu">
            <button className="user-button">
              <span className="user-avatar">👤</span>
              <span className="user-name">Usuario</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;