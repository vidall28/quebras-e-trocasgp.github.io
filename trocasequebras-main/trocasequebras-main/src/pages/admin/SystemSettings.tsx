
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  SettingsIcon, 
  BellIcon, 
  ShieldIcon, 
  RefreshCwIcon,
  ServerIcon,
  SaveIcon,
  CheckIcon,
  SmartphoneIcon,
  DatabaseIcon
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const SystemSettings: React.FC = () => {
  const [notifyApprovals, setNotifyApprovals] = useState(true);
  const [notifyRejections, setNotifyRejections] = useState(true);
  const [notifyNewUsers, setNotifyNewUsers] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);
  const [accessLogRetention, setAccessLogRetention] = useState('90');
  const [dataBackup, setDataBackup] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [apiEndpoint, setApiEndpoint] = useState('https://api.example.com/v1');
  const [sapIntegration, setSapIntegration] = useState(true);
  const [whatsappIntegration, setWhatsappIntegration] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('+55 11 99999-9999');
  
  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações do sistema foram atualizadas com sucesso.",
    });
  };
  
  const handleResetSettings = () => {
    toast({
      title: "Configurações redefinidas",
      description: "As configurações do sistema foram redefinidas para os valores padrão.",
    });
  };
  
  const handleClearCache = () => {
    toast({
      title: "Cache limpo",
      description: "O cache do sistema foi limpo com sucesso.",
    });
  };
  
  const handleTestConnection = () => {
    toast({
      title: "Teste de conexão",
      description: "Conexão com o endpoint realizada com sucesso.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden md:ml-[250px] transition-all duration-300">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie as configurações e preferências do sistema
              </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Geral
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <BellIcon className="h-4 w-4 mr-2" />
                  Notificações
                </TabsTrigger>
                <TabsTrigger value="security">
                  <ShieldIcon className="h-4 w-4 mr-2" />
                  Segurança
                </TabsTrigger>
                <TabsTrigger value="integrations">
                  <ServerIcon className="h-4 w-4 mr-2" />
                  Integrações
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Gerais</CardTitle>
                    <CardDescription>Gerenciar configurações básicas do sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Backup Automático de Dados</Label>
                          <p className="text-sm text-muted-foreground">Ativar backup diário dos dados do sistema</p>
                        </div>
                        <Switch 
                          checked={dataBackup} 
                          onCheckedChange={setDataBackup} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Sincronização Automática</Label>
                          <p className="text-sm text-muted-foreground">Sincronizar dados automaticamente com sistemas externos</p>
                        </div>
                        <Switch 
                          checked={autoSync} 
                          onCheckedChange={setAutoSync} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="api-endpoint">Endpoint da API</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="api-endpoint" 
                            value={apiEndpoint}
                            onChange={(e) => setApiEndpoint(e.target.value)}
                            placeholder="https://api.example.com"
                            className="flex-1"
                          />
                          <Button onClick={handleTestConnection} variant="outline">
                            Testar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="retention-days">Retenção de Logs (dias)</Label>
                        <Input 
                          id="retention-days" 
                          type="number"
                          value={accessLogRetention}
                          onChange={(e) => setAccessLogRetention(e.target.value)}
                          min="1"
                          max="365"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button onClick={handleClearCache} variant="outline">
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Limpar Cache
                    </Button>
                    <div className="flex gap-2">
                      <Button onClick={handleResetSettings} variant="outline">
                        Restaurar Padrão
                      </Button>
                      <Button onClick={handleSaveSettings} className="app-button">
                        <SaveIcon className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Notificações</CardTitle>
                    <CardDescription>Gerenciar como e quando as notificações são enviadas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Notificar Aprovações</Label>
                          <p className="text-sm text-muted-foreground">Receber notificações quando lançamentos forem aprovados</p>
                        </div>
                        <Switch 
                          checked={notifyApprovals} 
                          onCheckedChange={setNotifyApprovals} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Notificar Rejeições</Label>
                          <p className="text-sm text-muted-foreground">Receber notificações quando lançamentos forem rejeitados</p>
                        </div>
                        <Switch 
                          checked={notifyRejections} 
                          onCheckedChange={setNotifyRejections} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Notificar Novos Usuários</Label>
                          <p className="text-sm text-muted-foreground">Receber notificações quando novos usuários se registrarem</p>
                        </div>
                        <Switch 
                          checked={notifyNewUsers} 
                          onCheckedChange={setNotifyNewUsers} 
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button onClick={handleSaveSettings}>
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Salvar Preferências
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Segurança</CardTitle>
                    <CardDescription>Gerenciar configurações de segurança e acesso</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Autenticação de Dois Fatores</Label>
                          <p className="text-sm text-muted-foreground">Exigir autenticação de dois fatores para todos os usuários</p>
                        </div>
                        <Switch 
                          checked={twoFactorAuth} 
                          onCheckedChange={setTwoFactorAuth} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Logout Automático</Label>
                          <p className="text-sm text-muted-foreground">Desconectar usuários após 30 minutos de inatividade</p>
                        </div>
                        <Switch 
                          checked={autoLogout} 
                          onCheckedChange={setAutoLogout} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password-expiration">Expiração de Senhas (dias)</Label>
                        <Input 
                          id="password-expiration" 
                          type="number"
                          defaultValue="90"
                          min="30"
                          max="365"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button onClick={handleSaveSettings}>
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Salvar Configurações
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="integrations" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Integrações</CardTitle>
                    <CardDescription>Configurar integrações com sistemas externos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-6">
                      <div className="pb-4 border-b">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <DatabaseIcon className="h-5 w-5 text-blue-600" />
                            <Label className="text-base font-medium">Integração com SAP</Label>
                          </div>
                          <Switch 
                            checked={sapIntegration} 
                            onCheckedChange={setSapIntegration} 
                          />
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckIcon className="h-4 w-4 text-green-600" />
                            <span>Envio automático de dados para o SAP</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="h-4 w-4 text-green-600" />
                            <span>Sincronização de inventário</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="h-4 w-4 text-green-600" />
                            <span>Relatórios de baixas automáticas</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <SmartphoneIcon className="h-5 w-5 text-green-600" />
                            <Label className="text-base font-medium">Integração com WhatsApp</Label>
                          </div>
                          <Switch 
                            checked={whatsappIntegration} 
                            onCheckedChange={setWhatsappIntegration} 
                          />
                        </div>
                        
                        <div className="space-y-4 text-sm">
                          <div className="space-y-2">
                            <Label htmlFor="whatsapp-number">Número do WhatsApp</Label>
                            <Input 
                              id="whatsapp-number" 
                              value={whatsappNumber}
                              onChange={(e) => setWhatsappNumber(e.target.value)}
                              placeholder="+55 11 99999-9999"
                            />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <CheckIcon className="h-4 w-4 text-green-600" />
                            <span>Notificações automáticas de aprovação/rejeição</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="h-4 w-4 text-green-600" />
                            <span>Envio de resumo diário para gestores</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button onClick={handleSaveSettings}>
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Salvar Integrações
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemSettings;
