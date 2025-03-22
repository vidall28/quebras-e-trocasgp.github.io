
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-md w-full mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Sistema de Gestão de Trocas e Quebras</h1>
        <p className="text-muted-foreground">Crie sua conta com sua matrícula para acessar o sistema</p>
      </div>
      
      <RegisterForm />
    </div>
  );
};

export default Register;
