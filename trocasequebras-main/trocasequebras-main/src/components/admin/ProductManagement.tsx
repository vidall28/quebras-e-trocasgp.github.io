
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { Badge } from '@/components/ui/badge';
import { Search, Package, PackagePlus, XCircle, Edit, Trash } from 'lucide-react';
import { Check as CheckIcon } from "lucide-react";

// Tipo para produtos
type Product = {
  id: string;
  name: string;
  code: string;
  size: string;
  active: boolean;
};

// Chave para armazenamento no localStorage
const PRODUCTS_STORAGE_KEY = 'systemProducts';

// Produtos iniciais
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Itaipava', code: 'ITA269ML', size: '269ML', active: true },
  { id: '2', name: 'Itaipava', code: 'ITA350ML', size: '350ML', active: true },
  { id: '3', name: 'Itaipava', code: 'ITA473ML', size: '473ML', active: true },
  { id: '4', name: 'Crystal', code: 'CRY350ML', size: '350ML', active: true },
  { id: '5', name: 'Crystal', code: 'CRY473ML', size: '473ML', active: true },
  { id: '6', name: 'Bohemia', code: 'BOH350ML', size: '350ML', active: true },
  { id: '7', name: 'Bohemia', code: 'BOH550ML', size: '550ML', active: true },
  { id: '8', name: 'Stella Artois', code: 'STL350ML', size: '350ML', active: true },
  { id: '9', name: 'Coca-Cola', code: 'COLA350ML', size: '350ML', active: true },
  { id: '10', name: 'Coca-Cola', code: 'COLA2L', size: '2L', active: false },
];

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  
  // Estados para novo/edição de produto
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productSize, setProductSize] = useState('');
  const [productActive, setProductActive] = useState(true);

  // Carregar produtos
  useEffect(() => {
    const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      setProducts(parsedProducts);
      setFilteredProducts(parsedProducts);
    } else {
      // Inicializar com produtos padrão se não existirem no localStorage
      setProducts(INITIAL_PRODUCTS);
      setFilteredProducts(INITIAL_PRODUCTS);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }
  }, []);

  // Salvar produtos no localStorage quando forem atualizados
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    }
  }, [products]);

  // Filtrar produtos quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.size.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Alternar status ativo/inativo
  const toggleActiveStatus = (productId: string) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return { ...product, active: !product.active };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    
    const targetProduct = products.find(p => p.id === productId);
    if (targetProduct) {
      toast({
        title: "Status alterado",
        description: `${targetProduct.name} ${targetProduct.size} agora está ${targetProduct.active ? 'inativo' : 'ativo'}`,
      });
    }
  };

  // Editar produto
  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductName(product.name);
    setProductCode(product.code);
    setProductSize(product.size);
    setProductActive(product.active);
    setIsEditingProduct(true);
    setIsAddingProduct(false);
  };

  // Adicionar novo produto
  const handleAddProduct = () => {
    if (!productName.trim() || !productCode.trim() || !productSize.trim()) {
      toast({
        title: "Erro",
        description: "Nome, código e tamanho são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o código já existe
    if (!isEditingProduct && products.some(product => product.code === productCode)) {
      toast({
        title: "Erro",
        description: "Este código de produto já está cadastrado",
        variant: "destructive",
      });
      return;
    }

    if (isEditingProduct && editingProductId) {
      // Atualizar produto existente
      const updatedProducts = products.map(product => {
        if (product.id === editingProductId) {
          return {
            ...product,
            name: productName,
            code: productCode,
            size: productSize,
            active: productActive
          };
        }
        return product;
      });
      
      setProducts(updatedProducts);
      
      toast({
        title: "Produto atualizado",
        description: `${productName} ${productSize} foi atualizado com sucesso`,
      });
    } else {
      // Adicionar novo produto
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productName,
        code: productCode,
        size: productSize,
        active: productActive
      };

      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      
      toast({
        title: "Produto adicionado",
        description: `${newProduct.name} ${newProduct.size} foi adicionado com sucesso`,
      });
    }

    // Limpar campos
    resetForm();
  };

  // Remover produto
  const handleRemoveProduct = (productId: string) => {
    const targetProduct = products.find(p => p.id === productId);
    
    if (!targetProduct) return;
    
    // Em um ambiente real, isso poderia ser um modal de confirmação
    if (confirm(`Tem certeza que deseja remover ${targetProduct.name} ${targetProduct.size}?`)) {
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      
      toast({
        title: "Produto removido",
        description: `${targetProduct.name} ${targetProduct.size} foi removido com sucesso`,
      });
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setProductName('');
    setProductCode('');
    setProductSize('');
    setProductActive(true);
    setIsAddingProduct(false);
    setIsEditingProduct(false);
    setEditingProductId(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Gerenciamento de Produtos</h2>
        <p className="text-muted-foreground">Gerencie o catálogo de produtos do sistema</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Produtos</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nome, código ou tamanho"
                  className="pl-8 app-input w-full sm:w-auto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => {
                  if (isEditingProduct) {
                    resetForm();
                  } else {
                    setIsAddingProduct(!isAddingProduct);
                  }
                }}
                className="app-button"
              >
                {isEditingProduct ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar Edição
                  </>
                ) : isAddingProduct ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar
                  </>
                ) : (
                  <>
                    <PackagePlus className="h-4 w-4 mr-2" />
                    Adicionar Produto
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {(isAddingProduct || isEditingProduct) && (
            <Card className="mb-6 border-dashed">
              <CardHeader>
                <CardTitle className="text-base">
                  {isEditingProduct ? 'Editar Produto' : 'Novo Produto'}
                </CardTitle>
                <CardDescription>
                  {isEditingProduct 
                    ? 'Edite os dados do produto selecionado' 
                    : 'Preencha os dados para adicionar um novo produto'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Nome do Produto</Label>
                    <Input
                      id="product-name"
                      placeholder="Ex: Itaipava"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="app-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-code">Código</Label>
                    <Input
                      id="product-code"
                      placeholder="Ex: ITA269ML"
                      value={productCode}
                      onChange={(e) => setProductCode(e.target.value.toUpperCase())}
                      className="app-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-size">Tamanho</Label>
                    <Input
                      id="product-size"
                      placeholder="Ex: 269ML"
                      value={productSize}
                      onChange={(e) => setProductSize(e.target.value.toUpperCase())}
                      className="app-input"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="product-active"
                    checked={productActive}
                    onCheckedChange={setProductActive}
                  />
                  <Label htmlFor="product-active">Produto ativo</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddProduct}
                    className="app-button"
                  >
                    {isEditingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Table>
            <TableCaption>Catálogo de produtos do sistema</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {product.name}
                    </TableCell>
                    <TableCell>{product.code}</TableCell>
                    <TableCell>{product.size}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={
                          product.active 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }
                      >
                        {product.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActiveStatus(product.id)}
                        className="h-8 w-8 p-0"
                      >
                        {product.active ? <XCircle className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;
