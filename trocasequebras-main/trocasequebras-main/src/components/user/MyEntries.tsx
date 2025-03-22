
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Download, Eye, Clock, CheckCircle, XCircle, Edit, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Tipo para itens adicionados a um grupo
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

// Tipo para grupo de lançamentos
type EntryGroup = {
  id: string;
  name: string;
  type: 'troca' | 'quebra';
  items: EntryItem[];
  date: string; // Data em formato string para facilitar a serialização
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  userId?: string;
  userName?: string;
};

const MyEntries: React.FC = () => {
  const [entries, setEntries] = useState<EntryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Efeito para carregar lançamentos do usuário logado do localStorage
  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    
    // Carregar do localStorage
    const savedEntries = localStorage.getItem('userEntries');
    
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        // Filtrar apenas os lançamentos do usuário atual
        const userEntries = parsedEntries.filter((entry: EntryGroup) => entry.userId === user.id);
        setEntries(userEntries);
      } catch (error) {
        console.error('Erro ao carregar lançamentos:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus lançamentos",
          variant: "destructive",
        });
      }
    }
    
    setLoading(false);
  }, [user]);

  // Função para obter a cor do badge baseado no status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Função para obter nome amigável do status
  const getStatusName = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Desconhecido';
    }
  };

  // Função para continuar editando um rascunho
  const handleContinueEditing = (entry: EntryGroup) => {
    // Salvar no localStorage para continuar na tela de captura
    localStorage.setItem('currentEntryDraft', JSON.stringify(entry));
    
    // Remover do histórico de lançamentos (pois voltará a ser rascunho)
    const updatedEntries = entries.filter(e => e.id !== entry.id);
    localStorage.setItem('userEntries', JSON.stringify(updatedEntries));
    
    // Atualizar estado
    setEntries(updatedEntries);
    
    // Navegar para a tela de captura
    navigate('/data-capture');
    
    toast({
      title: "Rascunho carregado",
      description: "Você pode continuar editando seu lançamento",
    });
  };

  // Função para baixar todas as fotos como ZIP
  const handleDownloadAllPhotos = async (entry: EntryGroup) => {
    if (!entry.items || entry.items.length === 0 || !entry.items.some(item => item.photoUrl)) {
      toast({
        title: "Aviso",
        description: "Não há fotos para baixar neste lançamento",
      });
      return;
    }

    setIsDownloading(true);
    
    try {
      const zip = new JSZip();
      const folder = zip.folder(`lancamento_${entry.id.substring(0, 8)}`);
      
      if (!folder) {
        throw new Error("Erro ao criar pasta no arquivo ZIP");
      }
      
      // Criar uma lista de promessas para buscar cada imagem
      const photoPromises = entry.items
        .filter(item => item.photoUrl)
        .map(async (item, index) => {
          try {
            const response = await fetch(item.photoUrl as string);
            const blob = await response.blob();
            const fileName = `${item.productCode}_${item.quantity}UN_${index + 1}.jpg`;
            folder.file(fileName, blob);
            return true;
          } catch (error) {
            console.error(`Erro ao processar imagem ${index}:`, error);
            return false;
          }
        });
      
      // Esperar todas as promessas serem resolvidas
      await Promise.all(photoPromises);
      
      // Gerar o arquivo ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Baixar o arquivo
      saveAs(content, `lancamento_${entry.id.substring(0, 8)}.zip`);
      
      toast({
        title: "Download concluído",
        description: "Todas as fotos foram baixadas com sucesso",
      });
    } catch (error) {
      console.error('Erro ao baixar fotos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível baixar as fotos",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Função para baixar foto individual
  const handleDownloadPhoto = (item: EntryItem) => {
    if (!item.photoUrl) return;
    
    try {
      // Criar link de download
      const link = document.createElement('a');
      link.href = item.photoUrl;
      const fileName = `${item.productCode}_${item.quantity}UN.jpg`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: `Baixando foto de ${item.productName}`,
      });
    } catch (error) {
      console.error('Erro ao baixar foto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível baixar a foto",
        variant: "destructive",
      });
    }
  };

  // Função para exibir ícone de status
  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'draft':
        return <Edit size={16} className="text-yellow-600" />;
      case 'pending':
        return <Clock size={16} className="text-blue-600" />;
      case 'approved':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando seus lançamentos...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Meus Lançamentos</h2>
          <p className="text-muted-foreground">Histórico de lançamentos realizados</p>
        </div>
        
        <Card className="text-center p-8">
          <CardContent>
            <p className="text-muted-foreground my-6">Você ainda não tem lançamentos registrados.</p>
            <Button 
              onClick={() => navigate('/data-capture')}
              className="app-button"
            >
              Criar Novo Lançamento
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Meus Lançamentos</h2>
        <p className="text-muted-foreground">Histórico de lançamentos realizados</p>
      </div>

      <div className="grid gap-6">
        {entries.map((entry) => (
          <Card key={entry.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {entry.name}
                    <Badge className={`ml-2 ${getStatusColor(entry.status)}`}>
                      <StatusIcon status={entry.status} />
                      <span className="ml-1">{getStatusName(entry.status)}</span>
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    <span className="capitalize">{entry.type}</span> • 
                    {entry.date ? (
                      <span> {format(new Date(entry.date), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: pt })}</span>
                    ) : (
                      <span> Data não disponível</span>
                    )}
                  </CardDescription>
                </div>
                
                <div className="flex gap-2">
                  {entry.status === 'draft' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContinueEditing(entry)}
                    >
                      <Edit size={16} className="mr-1" />
                      Continuar Editando
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadAllPhotos(entry)}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 size={16} className="mr-1 animate-spin" />
                    ) : (
                      <Download size={16} className="mr-1" />
                    )}
                    Baixar Tudo
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="items">
                  <AccordionTrigger className="py-3">
                    <span className="flex items-center gap-2">
                      <Eye size={16} />
                      Ver {entry.items.length} {entry.items.length === 1 ? 'Produto' : 'Produtos'}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 mt-2">
                      {entry.items.map((item) => (
                        <div key={item.id} className="border rounded-md p-3 flex flex-col sm:flex-row justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{item.productName}</h4>
                              <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded">
                                {item.productSize}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Código: {item.productCode}
                            </div>
                            <div className="text-xs">
                              Quantidade: {item.quantity} un
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {item.photoUrl && (
                              <>
                                <div 
                                  className="h-12 w-12 rounded-md overflow-hidden border border-border bg-cover bg-center"
                                  style={{ backgroundImage: `url(${item.photoUrl})` }}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs"
                                  onClick={() => handleDownloadPhoto(item)}
                                >
                                  <Download size={14} className="mr-1" />
                                  Baixar
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            
            <CardFooter className="pt-0 pb-6 px-6">
              <div className="text-xs text-muted-foreground">
                ID: {entry.id.substring(0, 8)}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyEntries;
