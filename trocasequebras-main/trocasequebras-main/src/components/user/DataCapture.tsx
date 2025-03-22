
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  CameraIcon, 
  Trash2, 
  PlusCircle, 
  AlertTriangle, 
  SaveIcon, 
  SendIcon,
  Check,
  ChevronsUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Dados mockados para produtos - em uma app real viriam do backend
const MOCK_PRODUCTS = [
  { id: '1', name: 'Skol', code: 'SKL350ML', size: '350ML' },
  { id: '2', name: 'Itaipava', code: 'ITA350ML', size: '350ML' },
  { id: '3', name: 'Brahma', code: 'BRA350ML', size: '350ML' },
  { id: '4', name: 'Antarctica', code: 'ANT350ML', size: '350ML' },
  { id: '5', name: 'Heineken', code: 'HEI350ML', size: '350ML' },
  { id: '6', name: 'Budweiser', code: 'BUD350ML', size: '350ML' },
  { id: '7', name: 'Corona', code: 'COR350ML', size: '350ML' },
  { id: '8', name: 'Stella Artois', code: 'STE350ML', size: '350ML' },
  { id: '9', name: 'Bohemia', code: 'BOH350ML', size: '350ML' },
  { id: '10', name: 'Eisenbahn', code: 'EIS350ML', size: '350ML' },
  { id: '11', name: 'Original', code: 'ORI600ML', size: '600ML' },
  { id: '12', name: 'Brahma', code: 'BRA600ML', size: '600ML' },
  { id: '13', name: 'Skol', code: 'SKL600ML', size: '600ML' },
  { id: '14', name: 'Itaipava', code: 'ITA600ML', size: '600ML' },
  { id: '15', name: 'Heineken', code: 'HEI600ML', size: '600ML' },
  { id: '16', name: 'Coca-Cola', code: 'COCA350ML', size: '350ML' },
  { id: '17', name: 'Coca-Cola', code: 'COCA600ML', size: '600ML' },
  { id: '18', name: 'Guaraná Antarctica', code: 'GUA350ML', size: '350ML' },
  { id: '19', name: 'Guaraná Antarctica', code: 'GUA600ML', size: '600ML' },
  { id: '20', name: 'Pepsi', code: 'PEP350ML', size: '350ML' },
];

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
  date: Date | null;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  userId?: string;
  userName?: string;
};

const DataCapture: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const [entryType, setEntryType] = useState<'troca' | 'quebra'>('quebra');
  const [currentProduct, setCurrentProduct] = useState<string>('');
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [currentPhoto, setCurrentPhoto] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [items, setItems] = useState<EntryItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [isAutoCompleteOpen, setIsAutoCompleteOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Verificar se há um rascunho no localStorage
  useEffect(() => {
    const draftData = localStorage.getItem('currentEntryDraft');
    if (draftData) {
      try {
        const draft = JSON.parse(draftData);
        setGroupName(draft.name || '');
        setEntryType(draft.type || 'quebra');
        setItems(draft.items || []);
        toast({
          title: "Rascunho carregado",
          description: "Seu lançamento anterior foi restaurado.",
        });
      } catch (error) {
        console.error('Erro ao carregar rascunho:', error);
      }
    }
  }, []);

  // Verificar se o formulário pode ser enviado
  useEffect(() => {
    setIsSubmitDisabled(
      !groupName.trim() || 
      items.length === 0
    );
  }, [groupName, items]);

  // Manipular arquivo de imagem
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentPhoto(e.target.files[0]);
      setPhotoPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Iniciar câmera
  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (error) {
        console.error('Erro ao acessar a câmera:', error);
        toast({
          title: "Erro",
          description: "Não foi possível acessar a câmera.",
          variant: "destructive",
        });
      }
    }
  };

  // Capturar foto da câmera
  const capturePhoto = () => {
    if (videoRef.current && cameraActive) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
              setCurrentPhoto(file);
              setPhotoPreviewUrl(URL.createObjectURL(file));
              stopCamera();
            }
          }, 'image/jpeg');
        }
      } catch (error) {
        console.error('Erro ao capturar foto:', error);
      }
    }
  };

  // Parar câmera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Adicionar item à lista
  const addItem = () => {
    if (!currentProduct) {
      toast({
        title: "Erro",
        description: "Selecione um produto.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuantity <= 0) {
      toast({
        title: "Erro",
        description: "A quantidade deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if (!currentPhoto) {
      toast({
        title: "Erro",
        description: "Adicione uma foto do produto.",
        variant: "destructive",
      });
      return;
    }

    // Encontrar o produto selecionado nos produtos mocados
    const selectedProduct = MOCK_PRODUCTS.find(p => p.id === currentProduct);
    if (!selectedProduct) {
      toast({
        title: "Erro",
        description: "Produto não encontrado.",
        variant: "destructive",
      });
      return;
    }

    // Criar o novo item
    const newItem: EntryItem = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productCode: selectedProduct.code,
      productSize: selectedProduct.size,
      quantity: currentQuantity,
      photo: currentPhoto,
      photoUrl: photoPreviewUrl
    };

    // Adicionar à lista
    setItems([...items, newItem]);

    // Limpar o formulário
    setCurrentProduct('');
    setCurrentQuantity(1);
    setCurrentPhoto(null);
    setPhotoPreviewUrl(null);

    toast({
      title: "Produto adicionado",
      description: `${selectedProduct.name} adicionado com sucesso.`,
    });

    // Salvar o progresso atual como rascunho
    saveProgressAsDraft();
  };

  // Remover item da lista
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    
    // Atualizar o rascunho
    saveProgressAsDraft();
  };

  // Salvar progresso como rascunho
  const saveProgressAsDraft = () => {
    const draft: EntryGroup = {
      id: Date.now().toString(),
      name: groupName,
      type: entryType,
      items: items,
      date: new Date(),
      status: 'draft',
      userId: user?.id,
      userName: user?.name
    };

    localStorage.setItem('currentEntryDraft', JSON.stringify(draft));
  };

  // Finalizar o grupo como rascunho
  const finalizeDraft = () => {
    setIsSubmitting(true);

    try {
      const finalGroup: EntryGroup = {
        id: Date.now().toString(),
        name: groupName,
        type: entryType,
        items: items,
        date: new Date(),
        status: 'draft',
        userId: user?.id,
        userName: user?.name
      };

      // Recuperar lançamentos existentes do usuário
      const existingEntriesStr = localStorage.getItem('userEntries');
      const existingEntries = existingEntriesStr ? JSON.parse(existingEntriesStr) : [];
      
      // Adicionar o novo lançamento
      const updatedEntries = [...existingEntries, finalGroup];
      
      // Salvar no localStorage
      localStorage.setItem('userEntries', JSON.stringify(updatedEntries));
      
      // Limpar o rascunho atual
      localStorage.removeItem('currentEntryDraft');
      
      // Mensagem de sucesso
      toast({
        title: "Rascunho salvo",
        description: "Seu lançamento foi salvo como rascunho.",
      });
      
      // Redirecionar para a lista de lançamentos
      navigate('/my-entries');
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o rascunho.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Finalizar o grupo e enviar para aprovação
  const finalizeGroup = () => {
    setIsSending(true);

    try {
      const finalGroup: EntryGroup = {
        id: Date.now().toString(),
        name: groupName,
        type: entryType,
        items: items,
        date: new Date(),
        status: 'pending',
        userId: user?.id,
        userName: user?.name
      };

      console.log('Grupo finalizado:', finalGroup);

      // Recuperar lançamentos existentes do usuário
      const existingEntriesStr = localStorage.getItem('userEntries');
      const existingEntries = existingEntriesStr ? JSON.parse(existingEntriesStr) : [];
      
      // Adicionar o novo lançamento
      const updatedEntries = [...existingEntries, finalGroup];
      
      // Salvar no localStorage
      localStorage.setItem('userEntries', JSON.stringify(updatedEntries));
      
      // Limpar o rascunho atual
      localStorage.removeItem('currentEntryDraft');
      
      // Mensagem de sucesso
      toast({
        title: "Lançamento enviado",
        description: "Seu lançamento foi enviado para aprovação.",
      });
      
      // Fechar diálogo e redirecionar
      setConfirmDialogOpen(false);
      navigate('/my-entries');
    } catch (error) {
      console.error('Erro ao finalizar grupo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o lançamento.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Captura de Dados</h2>
        <p className="text-muted-foreground">Registre produtos com quebras ou para troca</p>
      </div>

      {/* Seção de informações do grupo */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Informações</CardTitle>
          <CardDescription>Informe os dados básicos do lançamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Nome do Grupo</Label>
              <Input
                id="group-name"
                placeholder="Ex: Quebra Dia 22/03"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  saveProgressAsDraft();
                }}
                className="app-input"
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <RadioGroup
                value={entryType}
                onValueChange={(value: 'troca' | 'quebra') => {
                  setEntryType(value);
                  saveProgressAsDraft();
                }}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quebra" id="type-quebra" />
                  <Label htmlFor="type-quebra" className="cursor-pointer">Quebra</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="troca" id="type-troca" />
                  <Label htmlFor="type-troca" className="cursor-pointer">Troca</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de adição de produtos */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Adicionar Produto</CardTitle>
          <CardDescription>Selecione um produto e adicione uma foto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product">Produto</Label>
              <Popover open={isAutoCompleteOpen} onOpenChange={setIsAutoCompleteOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isAutoCompleteOpen}
                    className="w-full justify-between app-input"
                  >
                    {currentProduct
                      ? MOCK_PRODUCTS.find((product) => product.id === currentProduct)?.name + " - " + 
                        MOCK_PRODUCTS.find((product) => product.id === currentProduct)?.size
                      : "Selecione um produto..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar produto..." />
                    <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                      {MOCK_PRODUCTS.map((product) => (
                        <CommandItem
                          key={product.id}
                          value={product.id}
                          onSelect={(value) => {
                            setCurrentProduct(value === currentProduct ? "" : value);
                            setIsAutoCompleteOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              currentProduct === product.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {product.name} - {product.size} ({product.code})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 0)}
                className="app-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Foto</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {photoPreviewUrl ? (
                  <div className="relative">
                    <img
                      src={photoPreviewUrl}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-md border border-border"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 bg-white bg-opacity-70"
                      onClick={() => {
                        setCurrentPhoto(null);
                        setPhotoPreviewUrl(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="border-2 border-dashed border-border rounded-md h-40 flex flex-col items-center justify-center p-4">
                      <CameraIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        Tire uma foto ou faça upload
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={startCamera}
                      >
                        <CameraIcon className="h-4 w-4 mr-2" />
                        Câmera
                      </Button>
                      <Label
                        htmlFor="photo-upload"
                        className="flex-1 flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Upload
                        <Input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-end">
                <Button
                  onClick={addItem}
                  className="app-button w-full"
                  disabled={!currentProduct || currentQuantity <= 0 || !currentPhoto}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>
            </div>
          </div>

          {/* Modal da câmera */}
          {cameraActive && (
            <Dialog open={cameraActive} onOpenChange={() => stopCamera()}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Capturar Foto</DialogTitle>
                  <DialogDescription>
                    Posicione o produto no centro da imagem
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-2">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 bg-black rounded-md"
                  ></video>
                </div>
                <DialogFooter className="sm:justify-center">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={stopCamera}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={capturePhoto}
                    className="app-button"
                  >
                    <CameraIcon className="h-4 w-4 mr-2" />
                    Capturar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>

      {/* Lista de produtos adicionados */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Produtos Adicionados</CardTitle>
          <CardDescription>
            {items.length === 0
              ? "Nenhum produto adicionado ainda"
              : `${items.length} ${items.length === 1 ? 'produto adicionado' : 'produtos adicionados'}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-6">
              <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                Adicione pelo menos um produto para continuar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    {item.photoUrl && (
                      <div 
                        className="w-12 h-12 rounded overflow-hidden bg-cover bg-center flex-shrink-0 border border-border"
                        style={{ backgroundImage: `url(${item.photoUrl})` }}
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{item.productSize}</span>
                        <span>•</span>
                        <span>Qtde: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="text-blue-600"
                disabled={isSubmitDisabled}
              >
                <SaveIcon className="h-4 w-4 mr-2" />
                Salvar Rascunho
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Salvar como rascunho?</h4>
                <p className="text-sm text-muted-foreground">
                  O lançamento será salvo como rascunho e você poderá continuar depois.
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={finalizeDraft}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Rascunho'}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={isSubmitDisabled}
                className="app-button"
              >
                <SendIcon className="h-4 w-4 mr-2" />
                Enviar para Aprovação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Envio</DialogTitle>
                <DialogDescription>
                  Ao enviar este lançamento, ele será submetido para aprovação e você não poderá editá-lo.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm font-medium">Resumo do lançamento:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>Grupo: {groupName}</li>
                  <li>Tipo: {entryType === 'quebra' ? 'Quebra' : 'Troca'}</li>
                  <li>Produtos: {items.length}</li>
                </ul>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setConfirmDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={finalizeGroup}
                  disabled={isSending}
                  className="app-button"
                >
                  {isSending ? 'Enviando...' : 'Confirmar Envio'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DataCapture;
