import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../services/Auth';
import { LayoutDashboard, Calendar, Settings, LogOut, ChevronRight } from 'lucide-react';
import logoImage from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const { participante } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const { mutate: logoutFn } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("participanteId");
      navigate("/");
    },
    onError: (error) => {
      console.log("Erro ao fazer logout", error);
    }
  });

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'my-events', icon: Calendar, label: 'Meus Eventos', path: '/inscricoes' },
    { id: 'settings', icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <aside
      className={`sidebar bg-indigo-700 text-white transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4">
        <div className="flex items-center justify-center">
          <img src={logoImage} alt="Logo" className={`transition-all ${isExpanded ? 'w-50 h-25' : 'w-100 h-10'}`} />
        </div>
        {isExpanded && (
          <div className={`mt-4 p-2 bg-indigo-600 rounded-lg text-center shadow-lg`}>
            <p className="text-lg font-semibold text-white">Bem-vindo!</p>
            <p className="text-sm text-indigo-200">{participante?.email}</p>
          </div>
        )}
      </div>

      <nav className="sidebar-nav mt-8">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center p-4 hover:bg-indigo-800 transition-colors ${window.location.pathname === item.path ? 'bg-indigo-800' : ''}`}
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

export default Navigation;
