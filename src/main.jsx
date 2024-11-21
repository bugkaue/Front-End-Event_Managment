import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../src/Router/App.jsx'
import './styles/Usuario/index.css'
import "./styles/responsive.css";
import "./styles/Admin/AdminNavigation.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
