import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  ChevronRight,
  Settings,
  LogOut
} from 'lucide-react';
import logoImage from '../../assets/logo.png';
import { useAuthLogout } from '../../services/AdminAuth';

const AdminNavigation = () => {
  const navigate = useNavigate();
  const { mutate: logoutFn } = useAuthLogout();
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/admin-dashboard' },
    { id: 'usuarios', icon: Users, label: 'Usuários', path: '/usuarios' },
    { id: 'gerencia-eventos', icon: Calendar, label: 'Gerenciar Eventos', path: '/gerencia-eventos' },
    { id: 'settings', icon: Settings, label: 'Configurações', path: '#' }, 
  ];

  return (
    <aside
      className={`sidebar bg-indigo-700 text-white transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'
        }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sidebar-logo p-4">
        <ChevronRight
          className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      <nav className="sidebar-nav mt-8">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center p-4 hover:bg-indigo-800 transition-colors ${window.location.pathname === item.path ? 'bg-indigo-800' : ''
                  }`}
              >
                <item.icon className="w-6 h-6" />
                {isExpanded && <span className="ml-4">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full">
        <button
          className="w-full flex items-center p-4 hover:bg-indigo-800 transition-colors"
          onClick={() => logoutFn()}
        >
          <LogOut className="w-6 h-6" />
          {isExpanded && <span className="ml-4">Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminNavigation;
