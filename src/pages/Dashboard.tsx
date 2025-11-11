import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Trash2, AlertCircle, Battery, Wifi, TrendingUp, MapPin } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { data: containers = [] } = trpc.containers.list.useQuery();
  const { data: readings = [] } = trpc.containers.readings.useQuery();
  const [selectedContainer, setSelectedContainer] = useState<number | null>(null);

  // Get latest reading for each container
  const getLatestReading = (containerId: number) => {
    return readings
      .filter((r: any) => r.containerId === containerId)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .at(0);
  };

  // Prepare chart data
  const containerLevelData = containers.map((container: any) => {
    const reading = getLatestReading(container.id);
    return {
      name: container.name.replace('Container ', ''),
      level: reading?.level ?? 0,
    };
  });

  const batteryData = containers.map((container: any) => {
    const reading = getLatestReading(container.id);
    return {
      name: container.name.replace('Container ', ''),
      battery: reading?.battery ?? 0,
    };
  });

  const statusData = [
    { name: 'Ativo', value: containers.filter((c: any) => c.status === 'active').length },
    { name: 'Inativo', value: containers.filter((c: any) => c.status === 'inactive').length },
    { name: 'Manutenção', value: containers.filter((c: any) => c.status === 'maintenance').length },
  ];

  const fullContainers = containerLevelData.filter(c => c.level >= 80).length;
  const lowBattery = batteryData.filter(b => b.battery <= 30).length;
  const avgLevel = Math.round(containerLevelData.reduce((sum, c) => sum + c.level, 0) / containerLevelData.length);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Dashboard de Containers</h1>
          <p className="text-gray-600 text-lg">Monitore em tempo real o status de todos os seus containers de lixo</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Containers */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-green-100 text-sm font-medium">Total de Containers</p>
                <Trash2 className="h-5 w-5 text-green-200" />
              </div>
              <div className="text-4xl font-bold">{containers.length}</div>
              <p className="text-green-100 text-sm mt-2">Monitorados</p>
            </div>
          </div>

          {/* Nível Médio */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-emerald-100 text-sm font-medium">Nível Médio</p>
                <TrendingUp className="h-5 w-5 text-emerald-200" />
              </div>
              <div className="text-4xl font-bold">{avgLevel}%</div>
              <p className="text-emerald-100 text-sm mt-2">Preenchimento</p>
            </div>
          </div>

          {/* Containers Cheios */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-orange-100 text-sm font-medium">Acima de 80%</p>
                <AlertCircle className="h-5 w-5 text-orange-200" />
              </div>
              <div className="text-4xl font-bold">{fullContainers}</div>
              <p className="text-orange-100 text-sm mt-2">Precisam coleta</p>
            </div>
          </div>

          {/* Bateria Baixa */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-6 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-red-100 text-sm font-medium">Bateria Baixa</p>
                <Battery className="h-5 w-5 text-red-200" />
              </div>
              <div className="text-4xl font-bold">{lowBattery}</div>
              <p className="text-red-100 text-sm mt-2">Precisam manutenção</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Nível de Preenchimento */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Nível de Preenchimento</h3>
              <p className="text-gray-300 text-sm">Status atual de cada container</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={containerLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                />
                <Bar dataKey="level" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status dos Containers */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Status dos Containers</h3>
              <p className="text-gray-300 text-sm">Distribuição por status</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bateria dos Sensores */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Nível de Bateria dos Sensores</h3>
              <p className="text-gray-300 text-sm">Monitoramento de energia dos sensores</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={batteryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                />
                <Line type="monotone" dataKey="battery" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Containers List */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-xl">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Detalhes dos Containers</h3>
            <p className="text-gray-300 text-sm">Informações detalhadas de cada container</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {containers.map((container: any) => {
              const reading = getLatestReading(container.id);
              const level = reading?.level ?? 0;
              const battery = reading?.battery ?? 0;
              const rssi = reading?.rssi ?? 0;

              return (
                <div
                  key={container.id}
                  onClick={() => setSelectedContainer(container.id)}
                  className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-bold text-white text-lg">{container.name}</h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          container.status === 'active'
                            ? 'bg-green-500/20 text-green-300'
                            : container.status === 'maintenance'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }`}
                      >
                        {container.status === 'active'
                          ? 'Ativo'
                          : container.status === 'maintenance'
                          ? 'Manutenção'
                          : 'Inativo'}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {parseFloat(String(container.latitude)).toFixed(4)}, {parseFloat(String(container.longitude)).toFixed(4)}
                    </p>

                    {/* Level Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm">Nível de Lixo</span>
                        <span className="font-bold text-white">{level}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            level >= 80
                              ? 'bg-red-500'
                              : level >= 50
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${level}%` }}
                        />
                      </div>
                    </div>

                    {/* Battery Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm flex items-center gap-2">
                          <Battery className="h-4 w-4" />
                          Bateria
                        </span>
                        <span className="font-bold text-white">{battery}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            battery <= 30
                              ? 'bg-red-500'
                              : battery <= 60
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${battery}%` }}
                        />
                      </div>
                    </div>

                    {/* RSSI */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        Sinal
                      </span>
                      <span className="text-gray-300">{rssi} dBm</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Container Details */}
        {selectedContainer && containers.find((c: any) => c.id === selectedContainer) && (
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {containers.find((c: any) => c.id === selectedContainer)?.name}
              </h3>
              <button
                onClick={() => setSelectedContainer(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-400 text-sm mb-2">Localização</p>
                <p className="text-white font-semibold">
                  {parseFloat(String(containers.find((c: any) => c.id === selectedContainer)?.latitude)).toFixed(4)}, {parseFloat(String(containers.find((c: any) => c.id === selectedContainer)?.longitude)).toFixed(4)}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-400 text-sm mb-2">Nível Atual</p>
                <p className="text-white font-semibold">{getLatestReading(selectedContainer)?.level ?? 0}%</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-400 text-sm mb-2">Bateria</p>
                <p className="text-white font-semibold">{getLatestReading(selectedContainer)?.battery ?? 0}%</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-400 text-sm mb-2">Última Atualização</p>
                <p className="text-white font-semibold text-sm">
                  {getLatestReading(selectedContainer) as any
                    ? new Date((getLatestReading(selectedContainer) as any).timestamp).toLocaleString('pt-BR')
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}