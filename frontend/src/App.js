import React from 'react';
import Layout from './components/layout/layout';
import SucursalList from './components/sucursales/SucursalList';
import './styles/globals.css';
import './styles/layout.css';
import './styles/sucursales.css';
import './styles/responsive.css';

function App() {
  return (
    <div className="App">
      <Layout>
        <SucursalList />
      </Layout>
    </div>
  );
}

export default App;