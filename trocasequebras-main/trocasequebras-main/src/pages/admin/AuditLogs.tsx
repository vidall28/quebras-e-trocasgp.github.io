
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SearchIcon, DownloadIcon, FilterIcon, InfoIcon, UsersIcon, ClipboardListIcon, SettingsIcon } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

// Tipo para log de auditoria
type AuditLog = {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  category: 'user' | 'entry' | 'system' | 'authentication';
  details: string;
  ip: string;
};

// Dados mockados para logs de auditoria
const generateMockLogs = (): AuditLog[] => {
  const actions = [
    { action: 'Usuário criado', category: 'user' as const },
    { action: 'Usuário atualizado', category: 'user' as const },
    { action: 'Usuário desativado', category: 'user' as const },
    { action: 'Login realizado', category: 'authentication' as const },
    { action: 'Login falhou', category: 'authentication' as const },
    { action: 'Senha redefinida', category: 'authentication' as const },
    { action: 'Lançamento criado', category: 'entry' as const },
    { action: 'Lançamento aprovado', category: 'entry' as const },
    { action: 'Lançamento rejeitado', category: 'entry' as const },
    { action: 'Configuração alterada', category: 'system' as const },
    { action: 'Backup realizado', category: 'system' as const },
    { action: 'Integração ativada', category: 'system' as const },
  ];
  
  const users = [
    { id: '1', name: 'Administrador' },
    { id: '2', name: 'João Silva' },
    { id: '3', name: 'Maria Souza' },
    { id: '4', name: 'Pedro Santos' },
    { id: '5', name: 'Ana Costa' },
  ];

  const logs: AuditLog[] = [];
  
  for (let i = 0; i < 50; i++) {
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(timestamp.getHours() - hoursAgo);
    timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);
    
    let details = '';
    switch (randomAction.category) {
      case 'user':
        details = `Usuário ${randomUser.name} (ID: ${randomUser.id})`;
        break;
      case 'entry':
        details = `Lançamento #${Math.floor(10000 + Math.random() * 90000)}`;
        break;
      case 'authentication':
        details = `IP: 192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        break;
      case 'system':
        details = `Alteração em configurações do sistema`;
        break;
    }
    
    logs.push({
      id: `log-${i + 1}`,
      timestamp,
      userId: randomUser.id,
      userName: randomUser.name,
      action: randomAction.action,
      category: randomAction.category,
      details,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    });
  }
  
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const MOCK_LOGS = generateMockLogs();

const AuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_LOGS);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;
  
  // Filtrar logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Paginação
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  
  // Função para obter ícone da categoria
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user':
        return <UsersIcon className="h-4 w-4" />;
      case 'entry':
        return <ClipboardListIcon className="h-4 w-4" />;
      case 'system':
        return <SettingsIcon className="h-4 w-4" />;
      case 'authentication':
        return <InfoIcon className="h-4 w-4" />;
      default:
        return <InfoIcon className="h-4 w-4" />;
    }
  };
  
  // Função para obter cor do badge para categoria
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'user':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'entry':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'system':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'authentication':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  // Função para obter nome amigável da categoria
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'user':
        return 'Usuários';
      case 'entry':
        return 'Lançamentos';
      case 'system':
        return 'Sistema';
      case 'authentication':
        return 'Autenticação';
      default:
        return 'Desconhecido';
    }
  };
  
  // Exportar logs
  const handleExportLogs = () => {
    // Em uma app real, isso geraria um arquivo CSV/Excel
    console.log('Exportando logs...');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden md:ml-[250px] transition-all duration-300">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Logs de Auditoria</h1>
              <p className="text-muted-foreground mt-2">
                Visualize e filtre o histórico de ações no sistema
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle>Histórico de Atividades</CardTitle>
                  <Button 
                    variant="outline" 
                    onClick={handleExportLogs}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Exportar Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
                  <div className="relative w-full sm:w-auto flex-1">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar logs..."
                      className="pl-8 app-input w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <FilterIcon className="h-4 w-4 text-muted-foreground" />
                    <Select
                      defaultValue="all"
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filtrar por categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas categorias</SelectItem>
                        <SelectItem value="user">Usuários</SelectItem>
                        <SelectItem value="entry">Lançamentos</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                        <SelectItem value="authentication">Autenticação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Data/Hora</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Detalhes</TableHead>
                        <TableHead className="text-right">IP</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <InfoIcon className="h-8 w-8 mb-2" />
                              <span>Nenhum log encontrado</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {format(log.timestamp, "dd/MM/yyyy HH:mm", { locale: pt })}
                            </TableCell>
                            <TableCell>{log.userName}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>
                              <Badge className={getCategoryBadgeClass(log.category)}>
                                <span className="flex items-center gap-1">
                                  {getCategoryIcon(log.category)}
                                  {getCategoryName(log.category)}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={log.details}>
                              {log.details}
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs">
                              {log.ip}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {filteredLogs.length > logsPerPage && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNumber: number;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }
                          
                          if (pageNumber < 1 || pageNumber > totalPages) return null;
                          
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                isActive={currentPage === pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditLogs;
