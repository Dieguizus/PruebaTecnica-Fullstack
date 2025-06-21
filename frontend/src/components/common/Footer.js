import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">🏢</span>
            <div className="footer-text">
              <h3>Somos Crédito</h3>
              <p>Sistema de Gestión Financiera</p>
            </div>
          </div>

          <div className="footer-info">
            <div className="info-group">
              <h4>Contacto</h4>
              <ul>
                <li>📞 2234-5678</li>
                <li>📧 info@somoscredito.com</li>
                <li>📍 Guatemala, Guatemala</li>
              </ul>
            </div>

            <div className="info-group">
              <h4>Enlaces</h4>
              <ul>
                <li><a href="#privacy">Política de Privacidad</a></li>
                <li><a href="#terms">Términos de Uso</a></li>
                <li><a href="#support">Soporte Técnico</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Somos Crédito. Todos los derechos reservados.</p>
          </div>
          <div className="footer-version">
            <p>Versión 1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;