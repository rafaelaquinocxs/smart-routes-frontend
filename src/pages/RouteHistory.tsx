import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fuel, Leaf, DollarSign, Clock, TrendingUp } from 'lucide-react';

export default function RouteHistory() {
  const [period, setPeriod] = useState<'day' | 'month' | 'year'>('month');
  
  // Fetch route history
  const { data: routeHistory = [], isLoading: historyLoading } = trpc.containers.getHistory.useQuery({
    limit: 100,
  });

  // Fetch total savings
  const { data: totalSavings } = trpc.containers.getTotalSavings.useQuery();

  // Fetch savings by period
  const { data: savingsByPeriod = [] } = trpc.containers.getSavingsByPeriod.useQuery({
    period,
  });

  // Prepare data for charts
  const chartData = savingsByPeriod.map((item: any) => ({
    period: item.period,
    fuel: parseFloat(item.totalFuel) || 0,
    co2: parseFloat(item.totalCo2) || 0,
    cost: parseFloat(item.totalCost) || 0,
    routes: item.routeCount || 0,
  }));

  // Calculate total metrics
  const totalMetrics = {
    fuel: totalSavings?.totalFuel ? parseFloat(String(totalSavings.totalFuel)) : 0,
    co2: totalSavings?.totalCo2 ? parseFloat(String(totalSavings.totalCo2)) : 0,
    cost: totalSavings?.totalCost ? parseFloat(String(totalSavings.totalCost)) : 0,
    time: totalSavings?.totalTime ? Math.round(parseFloat(String(totalSavings.totalTime))) : 0,
    routes: totalSavings?.routeCount ? parseInt(String(totalSavings.routeCount)) : 0,
  };

  const colors = {
    fuel: '#10b981',
    co2: '#059669',
    cost: '#047857',
    routes: '#10b981',
  };

  return (
    <AppLayout>
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Histórico de Rotas</h1>
          <p className="text-gray-600">Acompanhe todas as rotas otimizadas e a economia gerada</p>
        </div>

        {/* Total Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                <Fuel className="h-4 w-4" />
                Combustível Economizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalMetrics.fuel.toFixed(2)} L</div>
              <p className="text-xs text-slate-500 mt-1">Total em {totalMetrics.routes} rotas</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                CO₂ Evitado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalMetrics.co2.toFixed(2)} kg</div>
              <p className="text-xs text-slate-500 mt-1">Redução de emissões</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-500" />
                Custo Economizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">R$ {totalMetrics.cost.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Redução operacional</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                Tempo Economizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalMetrics.time} min</div>
              <p className="text-xs text-slate-500 mt-1">{(totalMetrics.time / 60).toFixed(1)} horas</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-indigo-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Total de Rotas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{totalMetrics.routes}</div>
              <p className="text-xs text-slate-500 mt-1">Rotas otimizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="trends" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="comparison">Comparação</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Economia ao Longo do Tempo</CardTitle>
                <CardDescription>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant={period === 'day' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setPeriod('day')}
                    >
                      Dia
                    </Button>
                    <Button 
                      variant={period === 'month' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setPeriod('month')}
                    >
                      Mês
                    </Button>
                    <Button 
                      variant={period === 'year' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setPeriod('year')}
                    >
                      Ano
                    </Button>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="fuel" stroke={colors.fuel} name="Combustível (L)" />
                    <Line type="monotone" dataKey="co2" stroke={colors.co2} name="CO₂ (kg)" />
                    <Line type="monotone" dataKey="cost" stroke={colors.cost} name="Custo (R$)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comparação de Economia por Período</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fuel" fill={colors.fuel} name="Combustível (L)" />
                    <Bar dataKey="co2" fill={colors.co2} name="CO₂ (kg)" />
                    <Bar dataKey="cost" fill={colors.cost} name="Custo (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Últimas Rotas Calculadas</CardTitle>
                <CardDescription>Detalhes das rotas otimizadas recentes</CardDescription>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="text-center py-8">Carregando histórico...</div>
                ) : routeHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">Nenhuma rota salva ainda</div>
                ) : (
                  <div className="space-y-4">
                    {routeHistory.slice(0, 10).map((route: any) => (
                      <div key={route.id} className="border rounded-lg p-4 bg-slate-50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-slate-500">Data</p>
                            <p className="font-semibold">
                              {new Date(route.routeDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Distância</p>
                            <p className="font-semibold">{route.totalDistance.toFixed(2)} km</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Containers</p>
                            <p className="font-semibold">{route.containersCount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Combustível Economizado</p>
                            <p className="font-semibold text-blue-600">
                              {route.savings?.fuelSaved?.toFixed(2) || '0.00'} L
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t">
                          <div>
                            <p className="text-xs text-slate-500">CO₂ Economizado</p>
                            <p className="font-semibold text-green-600">
                              {route.savings?.co2Saved?.toFixed(2) || '0.00'} kg
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Custo Economizado</p>
                            <p className="font-semibold text-amber-600">
                              R$ {route.savings?.costSaved?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Tempo Economizado</p>
                            <p className="font-semibold text-purple-600">
                              {route.savings?.timeSaved || 0} min
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Eficiência</p>
                            <p className="font-semibold text-indigo-600">
                              +{route.savings?.efficiencyGain?.toFixed(0) || '0'}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AppLayout>
  );
}
