
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  employeeId: string;
  isAdmin: boolean;
  status?: "active" | "inactive";
};

type AuthContextType = {
  user: User | null;
  login: (employeeId: string, password: string) => Promise<void>;
  register: (name: string, employeeId: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock dos usuários para demonstração
const INITIAL_MOCK_USERS = [
  {
    id: '1',
    name: 'Administrador',
    employeeId: 'admin',
    password: 'admin',
    isAdmin: true,
    status: 'active' as const
  },
  {
    id: '2',
    name: 'Usuário Teste',
    employeeId: '00293154',
    password: 'senha123',
    isAdmin: false,
    status: 'active' as const
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const storedUser = localStorage.getItem('user');
    
    // Garantir que os usuários iniciais estejam no sistema
    const systemUsers = localStorage.getItem('systemUsers');
    if (!systemUsers) {
      localStorage.setItem('systemUsers', JSON.stringify(INITIAL_MOCK_USERS));
    }
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (employeeId: string, password: string) => {
    setIsLoading(true);
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Obter usuários do sistema 
        const systemUsersStr = localStorage.getItem('systemUsers');
        const systemUsers = systemUsersStr 
          ? JSON.parse(systemUsersStr) 
          : INITIAL_MOCK_USERS;
        
        const foundUser = systemUsers.find(
          (u: any) => u.employeeId === employeeId && u.password === password && 
                     (u.status === undefined || u.status === 'active')
        );

        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          setIsLoading(false);
          resolve();
        } else {
          // Verificar se o usuário existe mas está inativo
          const inactiveUser = systemUsers.find(
            (u: any) => u.employeeId === employeeId && u.password === password && u.status === 'inactive'
          );
          
          if (inactiveUser) {
            setIsLoading(false);
            reject(new Error('Usuário inativo. Entre em contato com o administrador.'));
          } else {
            setIsLoading(false);
            reject(new Error('Matrícula ou senha inválidos'));
          }
        }
      }, 1000);
    });
  };

  const register = async (name: string, employeeId: string, password: string) => {
    setIsLoading(true);
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const systemUsersStr = localStorage.getItem('systemUsers');
        const systemUsers = systemUsersStr 
          ? JSON.parse(systemUsersStr) 
          : INITIAL_MOCK_USERS;
        
        const userExists = systemUsers.some(
          (u: any) => u.employeeId === employeeId
        );

        if (userExists) {
          setIsLoading(false);
          reject(new Error('Esta matrícula já está registrada'));
        } else {
          // Em um ambiente real, isso enviaria os dados para o backend
          const newUser = {
            id: String(Date.now()),
            name,
            employeeId,
            password,
            isAdmin: false,
            status: 'active' as const
          };
          
          // Atualizar usuários do sistema
          const updatedUsers = [...systemUsers, newUser];
          localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
          
          const { password: _, ...userWithoutPassword } = newUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          setIsLoading(false);
          resolve();
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
