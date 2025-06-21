import React, { useState } from 'react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
      active: false
    },
    {
      id: 'sucursales',
      label: 'Sucursales',
      icon: '🏢',
      path: '/sucursales',
      active: true
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: '👥',
      path: '/clientes',
      active: false
    },
    {
      id: 'creditos',
      label: 'Créditos',
      icon: '💰',
      path: '/creditos',
      active: false
    },
    {
      id: 'pagos',
      label: 'Pagos',
      icon: '💳',
      path: '/pagos',
      active: false
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: '📈',
      path: '/reportes',
      active: false
    }
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          title={collapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          {collapsed ? '▶️' : '◀️'}
        </button>
        
        {!collapsed && (
          <div className="sidebar-brand">
            <span className="brand-icon">🏢</span>
            <span className="brand-name">Menú</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map(item => (
            <li key={item.id} className="nav-item">
              <a 
                href={item.path}
                className={`nav-link ${item.active ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && (
                  <span className="nav-label">{item.label}</span>
                )}
                {item.active && <span className="nav-indicator"></span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">👤</div>
          {!collapsed && (
            <div className="user-info">
              <div className="user-name">Usuario Admin</div>
              <div className="user-role">Administrador</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;