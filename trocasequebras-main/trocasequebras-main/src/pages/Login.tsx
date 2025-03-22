
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-md w-full mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Sistema de Gestão de Trocas e Quebras</h1>
        <p className="text-muted-foreground">Entre com suas credenciais para acessar o sistema</p>
      </div>
      
      <LoginForm />
    </div>
  );
};

export default Login;
