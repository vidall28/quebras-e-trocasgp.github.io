
import React from 'react';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-border py-4 px-6 flex items-center justify-between h-16 shadow-sm">
      <div>
        <h1 className="text-lg font-medium">Sistema de Gestão de Trocas e Quebras</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">Matrícula: {user?.employeeId}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
