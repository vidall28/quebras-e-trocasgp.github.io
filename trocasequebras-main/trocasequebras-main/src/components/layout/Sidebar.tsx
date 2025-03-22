
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  MenuIcon, 
  XIcon, 
  HomeIcon, 
  CameraIcon, 
  ClipboardListIcon, 
  UsersIcon, 
  PackageIcon, 
  CheckSquareIcon, 
  LogOutIcon,
  BarChart2Icon,
  SettingsIcon,
  FileTextIcon
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAdmin = user?.isAdmin;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Links para usuários comuns
  const userLinks = [
    { path: '/data-capture', name: 'Captura de Dados', icon: <CameraIcon size={20} /> },
    { path: '/my-entries', name: 'Meus Lançamentos', icon: <ClipboardListIcon size={20} /> },
  ];

  // Links para administradores
  const adminLinks = [
    { path: '/approval-list', name: 'Aprovações', icon: <CheckSquareIcon size={20} /> },
    { path: '/user-management', name: 'Gerenciar Usuários', icon: <UsersIcon size={20} /> },
    { path: '/product-management', name: 'Gerenciar Produtos', icon: <PackageIcon size={20} /> },
    { path: '/reports', name: 'Relatórios', icon: <BarChart2Icon size={20} /> },
    { path: '/system-settings', name: 'Configurações', icon: <SettingsIcon size={20} /> },
    { path: '/audit-logs', name: 'Logs de Auditoria', icon: <FileTextIcon size={20} /> },
  ];

  // Seleciona links com base no tipo de usuário
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <>
      {/* Botão de toggle para dispositivos móveis */}
      <button
        className="fixed z-20 top-4 left-4 p-2 rounded-md bg-primary text-white md:hidden"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
      </button>
      
      {/* Overlay para fechar o sidebar em dispositivos móveis */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-sidebar text-sidebar-foreground z-30 
                  transition-all duration-300 ease-in-out transform 
                  ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                  md:translate-x-0 shadow-xl`}
        style={{ width: isOpen ? '250px' : '0', minWidth: isOpen ? '250px' : '0' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo e título */}
          <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
            <h1 className="text-xl font-bold">Sistema de Troca e Quebra</h1>
            <button
              className="md:block hidden rounded-md p-1 hover:bg-sidebar-accent transition-colors"
              onClick={toggleSidebar}
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>

          {/* Menu de navegação */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {/* Link para o dashboard para todos os usuários */}
              <li>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-3 p-3 rounded-md hover:bg-sidebar-accent transition-colors
                            ${location.pathname === '/dashboard' ? 'bg-sidebar-primary' : ''}`}
                >
                  <HomeIcon size={20} />
                  <span>Início</span>
                </Link>
              </li>
              
              {/* Links específicos para cada tipo de usuário */}
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-3 p-3 rounded-md hover:bg-sidebar-accent transition-colors
                              ${location.pathname === link.path ? 'bg-sidebar-primary' : ''}`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Informações do usuário e logout */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="mb-4 p-3 rounded-md bg-sidebar-accent">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs opacity-70">Matrícula: {user?.employeeId}</p>
              <p className="text-xs opacity-70">{user?.isAdmin ? 'Administrador' : 'Usuário'}</p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-sidebar-accent transition-colors text-red-300"
            >
              <LogOutIcon size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
