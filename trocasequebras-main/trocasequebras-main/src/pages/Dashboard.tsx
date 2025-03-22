
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRightIcon, 
  BarChart2, 
  Settings,
  Users,
  Package,
  ClipboardCheck,
  FileText,
  CameraIcon,
  ClipboardListIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden md:ml-[250px] transition-all duration-300">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Bem-vindo, {user?.name}!</h1>
              <p className="text-muted-foreground mt-2">
                Sistema de gerenciamento de trocas e quebras
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {isAdmin ? (
                // Cartões para administradores
                <>
                  <Card className="app-card hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>Relatórios</CardTitle>
                      <CardDescription>
                        Visualize relatórios e estatísticas
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="rounded-full bg-primary/10 p-6 mb-4">
                        <BarChart2 className="h-6 w-6 text-primary" />
                      </div>
                      <Button 
                        onClick={() => navigate('/reports')}
                        className="app-button w-full mt-2"
                      >
                        Ver Relatórios
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="app-card hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>Configurações</CardTitle>
                      <CardDescription>
                        Configure parâmetros do sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="rounded-full bg-primary/10 p-6 mb-4">
                        <Settings className="h-6 w-6 text-primary" />
                      </div>
                      <Button 
                        onClick={() => navigate('/system-settings')}
                        className="app-button w-full mt-2"
                      >
                        Configurar Sistema
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="app-card hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>Usuários</CardTitle>
                      <CardDescription>
                        Gerencie usuários do sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="rounded-full bg-primary/10 p-6 mb-4">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <Button 
                        onClick={() => navigate('/user-management')}
                        className="app-button w-full mt-2"
                      >
                        Gerenciar Usuários
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="app-card hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>Produtos</CardTitle>
                      <CardDescription>
                        Gerencie o catálogo de produtos
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="rounded-full bg-primary/10 p-6 mb-4">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <Button 
                        onClick={() => navigate('/product-management')}
                        className="app-button w-full mt-2"
                      >
                        Gerenciar Produtos
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="app-card hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>Aprovações</CardTitle>
                      <CardDescription>
                        Revise e aprove lançamentos
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="rounded-full bg-primary/10 p-6 mb-4">
                        <ClipboardCheck className="h-6 w-6 text-primary" />
                      </div>
                      <Button 
                        onClick={() => navigate('/approval-list')}
                        className="app-button w-full mt-2"
                      >
                        Aprovar Lançamentos
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="app-card hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>Logs de Auditoria</CardTitle>
                      <CardDescription>
                        Visualize atividades do sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="rounded-full bg-primary/10 p-6 mb-4">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <Button 
                        onClick={() => navigate('/audit-logs')}
                        className="app-button w-full mt-2"
                      >
                        Ver Logs
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </>
              ) : (
                // Cartões para usuários comuns
                <>
                  <Card className="app-card hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>Captura de Dados</CardTitle>
                      <CardDescription>
                        Registre produtos com fotos e informações
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="rounded-full bg-primary/10 p-6 mb-4">
                        <CameraIcon className="h-6 w-6 text-primary" />
                      </div>
                      <Button 
                        onClick={() => navigate('/data-capture')}
                        className="app-button w-full mt-2"
                      >
                        Ir para Captura
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="app-card hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle>Meus Lançamentos</CardTitle>
                      <CardDescription>
                        Visualize seu histórico de lançamentos
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="rounded-full bg-primary/10 p-6 mb-4">
                        <ClipboardListIcon className="h-6 w-6 text-primary" />
                      </div>
                      <Button 
                        onClick={() => navigate('/my-entries')}
                        className="app-button w-full mt-2"
                      >
                        Ver Lançamentos
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
