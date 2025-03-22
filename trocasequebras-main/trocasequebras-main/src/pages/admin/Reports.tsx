
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart, LineChart, DownloadIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Legend, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart as RechartsLine, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Dados mockados para os gráficos
const pieData = [
  { name: 'Quebras', value: 65 },
  { name: 'Trocas', value: 35 },
];

const barData = [
  { name: 'Jan', quebras: 12, trocas: 8 },
  { name: 'Fev', quebras: 15, trocas: 10 },
  { name: 'Mar', quebras: 18, trocas: 12 },
  { name: 'Abr', quebras: 10, trocas: 5 },
  { name: 'Mai', quebras: 20, trocas: 15 },
  { name: 'Jun', quebras: 17, trocas: 10 },
];

const lineData = [
  { name: 'Semana 1', aprovados: 10, rejeitados: 2 },
  { name: 'Semana 2', aprovados: 15, rejeitados: 3 },
  { name: 'Semana 3', aprovados: 12, rejeitados: 1 },
  { name: 'Semana 4', aprovados: 18, rejeitados: 4 },
];

const topProducts = [
  { name: 'Skol 350ML', count: 45 },
  { name: 'Brahma 350ML', count: 32 },
  { name: 'Heineken 350ML', count: 28 },
  { name: 'Antarctica 350ML', count: 25 },
  { name: 'Itaipava 350ML', count: 18 },
];

const Reports: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden md:ml-[250px] transition-all duration-300">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Relatórios</h1>
              <p className="text-muted-foreground mt-2">
                Visualize estatísticas e dados sobre lançamentos
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex gap-4">
                <Select defaultValue="30days">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Últimos 7 dias</SelectItem>
                    <SelectItem value="30days">Últimos 30 dias</SelectItem>
                    <SelectItem value="90days">Últimos 90 dias</SelectItem>
                    <SelectItem value="year">Este ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="products">Produtos</TabsTrigger>
                <TabsTrigger value="approvals">Aprovações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard title="Total de Lançamentos" value="156" trend="+12% no período" />
                  <StatCard title="Quebras" value="98" trend="+8% no período" />
                  <StatCard title="Trocas" value="58" trend="+15% no período" />
                  <StatCard title="Taxa de Aprovação" value="94%" trend="+2% no período" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Distribuição por Tipo</CardTitle>
                      <CardDescription>Proporção entre quebras e trocas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPie>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Legend />
                          </RechartsPie>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tendência Mensal</CardTitle>
                      <CardDescription>Lançamentos por mês</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBar data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="quebras" fill="#0088FE" name="Quebras" />
                            <Bar dataKey="trocas" fill="#00C49F" name="Trocas" />
                          </RechartsBar>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="products" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Produtos mais Reportados</CardTitle>
                      <CardDescription>Top 5 produtos com mais lançamentos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBar data={topProducts} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" name="Quantidade" />
                          </RechartsBar>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Produtos</CardTitle>
                      <CardDescription>Distribuição por frequência</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topProducts.map((product, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{product.name}</span>
                              <span className="text-sm">{product.count}</span>
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${(product.count / topProducts[0].count) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="approvals" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Taxa de Aprovação</CardTitle>
                      <CardDescription>Aprovados vs. Rejeitados por semana</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLine data={lineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="aprovados" stroke="#00C49F" activeDot={{ r: 8 }} name="Aprovados" />
                            <Line type="monotone" dataKey="rejeitados" stroke="#FF8042" name="Rejeitados" />
                          </RechartsLine>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Motivos de Rejeição</CardTitle>
                      <CardDescription>Principais causas de rejeição</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Foto com baixa qualidade</span>
                            <span className="text-sm">42%</span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '42%' }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Quantidades inconsistentes</span>
                            <span className="text-sm">28%</span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '28%' }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Informações incorretas</span>
                            <span className="text-sm">18%</span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '18%' }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Outros motivos</span>
                            <span className="text-sm">12%</span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '12%' }} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

// Componente de cartão de estatística
const StatCard = ({ title, value, trend }: { title: string; value: string; trend: string }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{trend}</p>
    </CardContent>
  </Card>
);

export default Reports;
