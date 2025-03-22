
import React, { useState, useEffect } from 'react';
import {
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  Download,
  Camera, 
  ShoppingBag,
  Loader2,
  Edit
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Tipos
type EntryItem = {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  productSize: string;
  quantity: number;
  photo: File | null;
  photoUrl: string | null;
};

type EntryStatus = 'draft' | 'pending' | 'approved' | 'rejected';

type EntryGroup = {
  id: string;
  name: string;
  type: 'troca' | 'quebra';
  items: EntryItem[];
  date: string; // Data em formato string
  status: EntryStatus;
  userId?: string;
  userName?: string;
};

const ApprovalList: React.FC = () => {
  const [entries, setEntries] = useState<EntryGroup[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<EntryGroup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const { user } = useAuth();

  // Carregar entradas reais do localStorage
  useEffect(() => {
    setIsLoading(true);
    
    try {
      // Buscar todas as entradas do sistema
      const userEntriesStr = localStorage.getItem('userEntries');
      if (userEntriesStr) {
        const allEntries = JSON.parse(userEntriesStr);
        // Filtrar apenas entradas pendentes ou que o admin já processou
        setEntries(allEntries);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error('Erro ao carregar entradas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os lançamentos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filtrar entradas com base na aba ativa
  const filteredEntries = entries.filter(entry => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return entry.status === 'pending';
    if (activeTab === 'approved') return entry.status === 'approved';
    if (activeTab === 'rejected') return entry.status === 'rejected';
    return true;
  });

  // Ver detalhes de uma entrada
  const handleViewEntry = (entry: EntryGroup) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  // Aprovar uma entrada
  const handleApprove = (id: string) => {
    const updatedEntries = entries.map(entry =>
      entry.id === id ? { ...entry, status: 'approved' as const } : entry
    );
    setEntries(updatedEntries);
    
    // Salvar no localStorage
    localStorage.setItem('userEntries', JSON.stringify(updatedEntries));
    
    setIsDialogOpen(false);
    
    toast({
      title: "Lançamento aprovado",
      description: `O lançamento #${id} foi aprovado com sucesso`,
    });
  };

  // Rejeitar uma entrada
  const handleReject = (id: string) => {
    const updatedEntries = entries.map(entry =>
      entry.id === id ? { ...entry, status: 'rejected' as const } : entry
    );
    setEntries(updatedEntries);
    
    // Salvar no localStorage
    localStorage.setItem('userEntries', JSON.stringify(updatedEntries));
    
    setIsDialogOpen(false);
    
    toast({
      title: "Lançamento rejeitado",
      description: `O lançamento #${id} foi rejeitado`,
      variant: "destructive",
    });
  };

  // Função para obter a cor do status
  const getStatusBadgeClass = (status: EntryStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    }
  };

  // Função para obter o texto do status
  const getStatusText = (status: EntryStatus) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      case 'draft':
        return 'Rascunho';
      default:
        return 'Pendente';
    }
  };

  // Função para obter o ícone do status
  const getStatusIcon = (status: EntryStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'draft':
        return <Edit className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  // Função para baixar todas as imagens como ZIP
  const downloadAllImages = async (entry: EntryGroup) => {
    if (!entry.items || entry.items.length === 0) {
      toast({
        title: "Aviso",
        description: "Não há imagens para baixar neste lançamento",
      });
      return;
    }

    setIsDownloading(true);
    
    try {
      const zip = new JSZip();
      const imagesFolder = zip.folder(`lancamento_${entry.id}`);
      
      if (!imagesFolder) {
        throw new Error("Não foi possível criar a pasta de imagens");
      }
      
      const photoPromises = entry.items.map(async (item, index) => {
        if (!item.photoUrl) return null;
        
        try {
          const response = await fetch(item.photoUrl);
          const blob = await response.blob();
          const fileName = `${item.productCode}_${item.quantity}UN_${index + 1}.jpg`;
          imagesFolder.file(fileName, blob);
          return true;
        } catch (error) {
          console.error(`Erro ao processar imagem ${index}:`, error);
          return null;
        }
      });
      
      await Promise.all(photoPromises);
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `lancamento_${entry.id}.zip`);
      
      toast({
        title: "Download concluído",
        description: "Todas as imagens foram baixadas com sucesso",
      });
    } catch (error) {
      console.error('Erro ao gerar arquivo ZIP:', error);
      toast({
        title: "Erro",
        description: "Não foi possível baixar as imagens",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando lançamentos...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Lista de Aprovações</h2>
        <p className="text-muted-foreground">Revise e aprove lançamentos de quebras e trocas</p>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="approved">Aprovados</TabsTrigger>
          <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Lançamentos {activeTab !== 'all' ? getStatusText(activeTab as EntryStatus) + 's' : ''}</CardTitle>
              <CardDescription>
                {activeTab === 'pending' ? 'Lançamentos que aguardam sua revisão' : 
                 activeTab === 'approved' ? 'Lançamentos já aprovados' : 
                 activeTab === 'rejected' ? 'Lançamentos rejeitados' : 
                 'Todos os lançamentos do sistema'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Lista de lançamentos para aprovação</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum lançamento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">#{entry.id.substring(0, 8)}</TableCell>
                        <TableCell>{entry.userName || 'Usuário desconhecido'}</TableCell>
                        <TableCell>
                          {entry.date ? new Date(entry.date).toLocaleDateString('pt-BR') : 'N/D'}
                        </TableCell>
                        <TableCell>{entry.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {entry.type === 'quebra' ? 
                              <><Camera className="h-3 w-3 mr-1" /> Quebra</> : 
                              <><ShoppingBag className="h-3 w-3 mr-1" /> Troca</>}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            className={getStatusBadgeClass(entry.status)}
                          >
                            <span className="flex items-center">
                              {getStatusIcon(entry.status)}
                              <span className="ml-1">{getStatusText(entry.status)}</span>
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewEntry(entry)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de detalhes */}
      {selectedEntry && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Lançamento #{selectedEntry.id.substring(0, 8)}
                <Badge 
                  className={getStatusBadgeClass(selectedEntry.status)}
                >
                  {getStatusText(selectedEntry.status)}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Detalhes do lançamento realizado por {selectedEntry.userName || 'Usuário desconhecido'} em {selectedEntry.date ? new Date(selectedEntry.date).toLocaleDateString('pt-BR') : 'data indisponível'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Informações</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Grupo:</span> {selectedEntry.name}</p>
                    <p><span className="font-medium">Tipo:</span> {selectedEntry.type === 'quebra' ? 'Quebra' : 'Troca'}</p>
                    <p><span className="font-medium">ID do usuário:</span> {selectedEntry.userId || 'N/D'}</p>
                    <p><span className="font-medium">Total de produtos:</span> {selectedEntry.items?.length || 0}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Produtos</h3>
                  <ul className="space-y-1 text-sm max-h-[150px] overflow-y-auto">
                    {selectedEntry.items && selectedEntry.items.map(item => (
                      <li key={item.id} className="border-b pb-1">
                        <span className="font-medium">{item.productName}</span> - 
                        {item.productCode} ({item.productSize}) - {item.quantity} unidades
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Imagens ({selectedEntry.items?.length || 0})</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadAllImages(selectedEntry)}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Baixando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Tudo
                      </>
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedEntry.items && selectedEntry.items.map((item, index) => (
                    item.photoUrl && (
                      <div key={index} className="rounded overflow-hidden border">
                        <img 
                          src={item.photoUrl} 
                          alt={`Imagem ${index + 1} do produto ${item.productName}`} 
                          className="w-full h-auto" 
                        />
                        <div className="p-2 bg-muted text-xs">
                          {item.productName} - {item.quantity} un
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              {selectedEntry.status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => handleReject(selectedEntry.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeitar
                  </Button>
                  <Button 
                    className="app-button"
                    onClick={() => handleApprove(selectedEntry.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                </>
              )}
              {selectedEntry.status !== 'pending' && (
                <Button onClick={() => setIsDialogOpen(false)}>
                  Fechar
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ApprovalList;
