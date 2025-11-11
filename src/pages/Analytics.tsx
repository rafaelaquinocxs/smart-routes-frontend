import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Leaf, Droplet, Wind, TrendingUp, DollarSign, Truck, Calendar, ArrowUp 
} from 'lucide-react';

const mockData = {
  monthly: [
    { month: 'Jan', combustivel: 45.2, co2: 112.5, custo: 180, rotas: 15 },
    { month: 'Fev', combustivel: 42.8, co2: 107, custo: 171, rotas: 14 },
    { month: 'Mar', combustivel: 48.5, co2: 121.25, custo: 194, rotas: 16 },
    { month: 'Abr', combustivel: 41.2, co2: 103, custo: 165, rotas: 13 },
    { month: 'Mai', combustivel: 39.8, co2: 99.5, custo: 159, rotas: 13 },
    { month: 'Jun', combustivel: 52.4, co2: 131, custo: 210, rotas: 17 },
  ],
  esg: [
    { name: 'CO₂ Evitado', value: 45, color: '#10b981' },
    { name: 'Combustível Economizado', value: 30, color: '#3b82f6' },
    { name: 'Custo Reduzido', value: 25, color: '#f59e0b' },
  ],
  projections: [
    { periodo: '1 Ano', combustivel: 470, co2: 1175, custo: 1880, arvores: 58 },
    { periodo: '2 Anos', combustivel: 940, co2: 2350, custo: 3760, arvores: 116 },
    { periodo: '5 Anos', combustivel: 2350, co2: 5875, custo: 9400, arvores: 290 },
  ]
};

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('1year');

  const projection = mockData.projections[selectedPeriod === '1year' ? 0 : selectedPeriod === '2years' ? 1 : 2];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Analytics Executiva
          </h1>
          <p className="text-xl text-gray-600">
            Visualize o impacto de Smart Routes em sua operação com dados em tempo real
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { 
              icon: Truck, 
              label: 'Combustível Economizado', 
              value: '470L', 
              subtext: 'Este mês',
              color: 'from-blue-500 to-cyan-500',
              change: '+12%'
            },
            { 
              icon: Wind, 
              label: 'CO₂ Evitado', 
              value: '1.17t', 
              subtext: 'Este mês',
              color: 'from-green-500 to-emerald-500',
              change: '+8%'
            },
            { 
              icon: DollarSign, 
              label: 'Custo Economizado', 
              value: 'R$ 1.880', 
              subtext: 'Este mês',
              color: 'from-orange-500 to-red-500',
              change: '+15%'
            },
            { 
              icon: Leaf, 
              label: 'Árvores Economizadas', 
              value: '58', 
              subtext: 'Equivalente',
              color: 'from-green-600 to-lime-500',
              change: '+20%'
            },
          ].map((kpi, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${kpi.color} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition`}>
              <div className="flex items-start justify-between mb-4">
                <kpi.icon className="h-10 w-10 opacity-80" />
                <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">{kpi.change}</span>
              </div>
              <p className="text-sm opacity-90 mb-2">{kpi.label}</p>
              <p className="text-3xl font-bold mb-1">{kpi.value}</p>
              <p className="text-xs opacity-75">{kpi.subtext}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Visão Geral' },
            { id: 'esg', label: 'Dados ESG' },
            { id: 'simulator', label: 'Simulador de Economia' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Monthly Trends */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tendências Mensais</h2>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={mockData.monthly}>
                  <defs>
                    <linearGradient id="colorCombustivel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="combustivel" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCombustivel)" name="Combustível (L)" />
                  <Area type="monotone" dataKey="co2" stroke="#10b981" fillOpacity={1} fill="url(#colorCo2)" name="CO₂ (kg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Charts */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Cost Savings */}
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Economia de Custo</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockData.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="custo" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Custo Economizado (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Routes Count */}
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Rotas Otimizadas</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rotas" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} name="Rotas/Mês" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ESG Tab */}
        {activeTab === 'esg' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* ESG Pie Chart */}
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Distribuição de Impacto ESG</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={mockData.esg}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockData.esg.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* ESG Metrics */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border-2 border-green-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">CO₂ Evitado</p>
                      <p className="text-4xl font-bold text-green-600">1.17t</p>
                    </div>
                    <Wind className="h-12 w-12 text-green-600 opacity-20" />
                  </div>
                  <p className="text-sm text-gray-600">Equivalente a remover 1 carro da rua por 6 meses</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border-2 border-blue-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Árvores Economizadas</p>
                      <p className="text-4xl font-bold text-blue-600">58</p>
                    </div>
                    <Leaf className="h-12 w-12 text-blue-600 opacity-20" />
                  </div>
                  <p className="text-sm text-gray-600">Árvores que não precisam ser cortadas</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-xl border-2 border-orange-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Água Economizada</p>
                      <p className="text-4xl font-bold text-orange-600">2.350L</p>
                    </div>
                    <Droplet className="h-12 w-12 text-orange-600 opacity-20" />
                  </div>
                  <p className="text-sm text-gray-600">Água não consumida em produção</p>
                </div>
              </div>
            </div>

            {/* ESG Report */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Relatório ESG Mensal</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: 'Sustentabilidade', score: '92%', desc: 'Redução de emissões' },
                  { title: 'Eficiência', score: '88%', desc: 'Otimização operacional' },
                  { title: 'Impacto Social', score: '85%', desc: 'Comunidade e meio ambiente' },
                ].map((report, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-2">{report.title}</p>
                    <p className="text-3xl font-bold text-green-600 mb-2">{report.score}</p>
                    <p className="text-sm text-gray-600">{report.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Simulator Tab */}
        {activeTab === 'simulator' && (
          <div className="space-y-8">
            {/* Period Selector */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Simulador de Economia</h2>
              <p className="text-gray-600 mb-6">Selecione o período para projetar economia futura</p>
              
              <div className="flex gap-4 mb-8">
                {[
                  { id: '1year', label: '1 Ano' },
                  { id: '2years', label: '2 Anos' },
                  { id: '5years', label: '5 Anos' },
                ].map(period => (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${
                      selectedPeriod === period.id
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>

              {/* Projection Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Combustível Economizado</p>
                  <p className="text-3xl font-bold text-blue-600">{projection.combustivel}L</p>
                  <p className="text-xs text-gray-600 mt-2">Em {projection.periodo}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
                  <p className="text-sm text-gray-600 mb-2">CO₂ Evitado</p>
                  <p className="text-3xl font-bold text-green-600">{projection.co2}kg</p>
                  <p className="text-xs text-gray-600 mt-2">Em {projection.periodo}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-lg border-2 border-orange-200">
                  <p className="text-sm text-gray-600 mb-2">Custo Economizado</p>
                  <p className="text-3xl font-bold text-orange-600">R$ {projection.custo.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 mt-2">Em {projection.periodo}</p>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-lime-500 p-6 rounded-lg text-white">
                  <p className="text-sm opacity-90 mb-2">Árvores Economizadas</p>
                  <p className="text-3xl font-bold">{projection.arvores}</p>
                  <p className="text-xs opacity-75 mt-2">Em {projection.periodo}</p>
                </div>
              </div>
            </div>

            {/* Projection Chart */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Projeção de Economia</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mockData.projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="combustivel" fill="#3b82f6" name="Combustível (L)" />
                  <Bar yAxisId="left" dataKey="co2" fill="#10b981" name="CO₂ (kg)" />
                  <Bar yAxisId="right" dataKey="custo" fill="#f59e0b" name="Custo (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ROI Section */}
            <div className="bg-gradient-to-br from-green-600 to-blue-600 p-8 rounded-xl text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Retorno sobre Investimento (ROI)</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <p className="text-sm opacity-90 mb-2">Investimento Inicial</p>
                  <p className="text-3xl font-bold">R$ 5.000</p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-2">Economia em {selectedPeriod === '1year' ? '1 Ano' : selectedPeriod === '2years' ? '2 Anos' : '5 Anos'}</p>
                  <p className="text-3xl font-bold">R$ {projection.custo.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-2">ROI</p>
                  <p className="text-3xl font-bold">{Math.round((projection.custo / 5000) * 100)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}