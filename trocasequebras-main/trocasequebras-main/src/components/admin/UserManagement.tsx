
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, XCircle, UserPlus, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Definindo o tipo User com status
type User = {
  id: string;
  name: string;
  employeeId: string;
  password: string;
  isAdmin: boolean;
  status: "active" | "inactive";
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  // Estados para novo usuário
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmployeeId, setNewUserEmployeeId] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);

  // Carregar usuários do localStorage
  useEffect(() => {
    const systemUsersStr = localStorage.getItem('systemUsers');
    if (systemUsersStr) {
      try {
        const systemUsers = JSON.parse(systemUsersStr);
        // Adicionar status aos usuários se não tiver
        const usersWithStatus = systemUsers.map((user: any) => ({
          ...user,
          status: user.status || "active" as const
        }));
        setUsers(usersWithStatus);
        setFilteredUsers(usersWithStatus);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de usuários",
          variant: "destructive",
        });
      }
    }
  }, []);

  // Filtrar usuários quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.employeeId.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Alternar status de administrador
  const toggleAdminStatus = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, isAdmin: !user.isAdmin };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    updateSystemUsers(updatedUsers);
    
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      toast({
        title: "Status alterado",
        description: `${targetUser.name} agora é ${!targetUser.isAdmin ? 'administrador' : 'usuário comum'}`,
      });
    }
  };

  // Alternar status ativo/inativo
  const toggleActiveStatus = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' as const : 'active' as const;
        return { ...user, status: newStatus };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    updateSystemUsers(updatedUsers);
    
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      toast({
        title: "Status alterado",
        description: `${targetUser.name} agora está ${targetUser.status === 'active' ? 'inativo' : 'ativo'}`,
      });
    }
  };

  // Atualizar usuários no localStorage
  const updateSystemUsers = (updatedUsers: User[]) => {
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
  };

  // Adicionar novo usuário
  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserEmployeeId.trim() || !newUserPassword.trim()) {
      toast({
        title: "Erro",
        description: "Nome, matrícula e senha são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Verificar se a matrícula já existe
    if (users.some(user => user.employeeId === newUserEmployeeId)) {
      toast({
        title: "Erro",
        description: "Esta matrícula já está cadastrada",
        variant: "destructive",
      });
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName,
      employeeId: newUserEmployeeId,
      password: newUserPassword,
      isAdmin: newUserIsAdmin,
      status: 'active',
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    updateSystemUsers(updatedUsers);
    
    // Limpar campos
    setNewUserName('');
    setNewUserEmployeeId('');
    setNewUserPassword('');
    setShowPassword(false);
    setNewUserIsAdmin(false);
    setIsAddingUser(false);
    
    toast({
      title: "Usuário adicionado",
      description: `${newUser.name} foi adicionado com sucesso`,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Gerenciamento de Usuários</h2>
        <p className="text-muted-foreground">Gerencie usuários e permissões do sistema</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Usuários</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nome ou matrícula"
                  className="pl-8 app-input w-full sm:w-auto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => setIsAddingUser(!isAddingUser)}
                className="app-button"
              >
                {isAddingUser ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Usuário
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingUser && (
            <Card className="mb-6 border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Novo Usuário</CardTitle>
                <CardDescription>Preencha os dados para adicionar um novo usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-user-name">Nome Completo</Label>
                    <Input
                      id="new-user-name"
                      placeholder="Nome do usuário"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="app-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-user-employee-id">Matrícula</Label>
                    <Input
                      id="new-user-employee-id"
                      placeholder="Ex: 00293154"
                      value={newUserEmployeeId}
                      onChange={(e) => setNewUserEmployeeId(e.target.value)}
                      className="app-input"
                    />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="new-user-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="new-user-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite a senha"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="app-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="new-user-is-admin"
                    checked={newUserIsAdmin}
                    onCheckedChange={setNewUserIsAdmin}
                  />
                  <Label htmlFor="new-user-is-admin">Usuário é administrador</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setIsAddingUser(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddUser}
                    className="app-button"
                  >
                    Adicionar Usuário
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Table>
            <TableCaption>Lista de usuários do sistema</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Nome</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Administrador</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      {user.name}
                    </TableCell>
                    <TableCell>{user.employeeId}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }
                      >
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={user.isAdmin}
                        onCheckedChange={() => toggleAdminStatus(user.id)}
                        aria-label="Toggle admin status"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActiveStatus(user.id)}
                      >
                        {user.status === 'active' ? 'Desativar' : 'Ativar'}
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

export default UserManagement;
