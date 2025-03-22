
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginForm: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(employeeId, password);
      navigate('/dashboard');
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao Sistema de Gestão de Trocas e Quebras",
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Credenciais inválidas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-lg border border-border bg-card shadow-sm animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        <p className="text-muted-foreground">Entre com sua matrícula e senha</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="app-input"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full app-button"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Registre-se
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
