
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não correspondem",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(name, employeeId, password);
      navigate('/dashboard');
      toast({
        title: "Registro realizado com sucesso",
        description: "Bem-vindo ao Sistema de Gestão de Trocas e Quebras",
      });
    } catch (error) {
      toast({
        title: "Erro ao registrar",
        description: error instanceof Error ? error.message : "Ocorreu um erro durante o registro",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-lg border border-border bg-card shadow-sm animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Registrar</h1>
        <p className="text-muted-foreground">Crie sua conta com sua matrícula</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="app-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employeeId">Matrícula</Label>
          <Input
            id="employeeId"
            type="text"
            placeholder="Ex: 00293154"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            className="app-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Crie uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="app-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="app-input"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full app-button"
        >
          {isLoading ? "Registrando..." : "Registrar"}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
