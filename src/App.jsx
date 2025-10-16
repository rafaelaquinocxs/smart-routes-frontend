import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  LayoutDashboard, 
  Map, 
  Trash2, 
  Route as RouteIcon, 
  Search, 
  Bell, 
  User, 
  RefreshCw,
  Plus,
  MapPin,
  Battery,
  CheckCircle,
  Clock,
  AlertTriangle  
} from 'lucide-react'
import axios from 'axios'
import AddContainerModal from './components/AddContainerModal'
import MapboxMap from './components/MapboxMap'
import './App.css'

// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <SmartRoutesApp />
      </div>
    </Router>
  )
}

function SmartRoutesApp() {
  const location = useLocation()
  const [containers, setContainers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // Carregar dados iniciais
  useEffect(() => {
    loadContainers()
  }, [])

  const loadContainers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/containers`)
      setContainers(response.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar containers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSuccess = () => {
    loadContainers()
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Smart Routes</h1>
              <p className="text-xs text-slate-400">v2.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <NavLink to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavLink to="/mapa" icon={Map} label="Mapa" />
            <NavLink to="/containers" icon={Trash2} label="Containers" />
            <NavLink to="/rotas" icon={RouteIcon} label="Rotas" />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-800">Smart Routes</h2>
              <span className="text-gray-400">›</span>
              <span className="text-gray-600 capitalize">
                {location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Buscar containers, rotas..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                3
              </Button>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Admin
              </Button>
              <Button onClick={loadContainers} size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard containers={containers} />} />
            <Route path="/mapa" element={<MapPage containers={containers} />} />
            <Route path="/containers" element={<ContainersPage containers={containers} loading={loading} onAddContainer={() => setShowAddModal(true)} />} />
            <Route path="/rotas" element={<RoutesPage />} />
          </Routes>
        </main>
      </div>

      {/* Modal para adicionar container */}
      <AddContainerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}

// Componente de navegação
function NavLink({ to, icon: Icon, label }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-slate-700 text-white' 
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  )
}

// Dashboard
function Dashboard({ containers }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de monitoramento</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Containers</CardTitle>
            <Trash2 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{containers.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-red-500">↓ 0% desde ontem</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rotas Ativas</CardTitle>
            <RouteIcon className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-red-500">↓ 0% desde ontem</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bateria Média</CardTitle>
            <Battery className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-red-500">↓ 0% desde ontem</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Eficiência</CardTitle>
            <CheckCircle className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-red-500">↓ 0% desde ontem</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status dos Containers</CardTitle>
            <CardDescription>Monitoramento em tempo real dos níveis de enchimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-gray-500">
              <div className="text-center">
                <Trash2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="font-medium">Nenhum container encontrado</p>
                <p className="text-sm">Os containers aparecerão aqui quando os sensores enviarem dados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas Recentes</CardTitle>
            <CardDescription>Últimas notificações do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-gray-500">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="font-medium">Nenhum alerta recente</p>
                <p className="text-sm">Sistema funcionando normalmente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Página do Mapa
function MapPage({ containers }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mapa</h1>
        <p className="text-gray-600">Visualização geográfica dos containers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <MapboxMap containers={containers} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Containers no Mapa</CardTitle>
              <CardDescription>Lista de containers com localização</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="font-medium">Nenhum container encontrado</p>
                <p className="text-sm">Os containers aparecerão aqui quando os sensores enviarem dados</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Página de Containers
function ContainersPage({ containers, loading, onAddContainer }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Containers</h1>
          <p className="text-gray-600">Gerenciamento e monitoramento de containers</p>
        </div>
        <Button onClick={onAddContainer}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Container
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Carregando containers...</span>
            </div>
          ) : containers.length > 0 ? (
            <div className="space-y-4">
              {containers.map((container) => (
                <div key={container.uid} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{container.name}</h3>
                        <p className="text-sm text-gray-600">UID: {container.uid}</p>
                        <p className="text-sm text-gray-600">{container.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={container.is_online ? "default" : "secondary"}>
                          {container.is_online ? "Online" : "Offline"}
                        </Badge>
                        <Badge variant="outline">{container.container_type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Status: {container.status}</p>
                      {container.latitude && container.longitude && (
                        <p className="text-xs text-gray-500">
                          {container.latitude.toFixed(4)}, {container.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Trash2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="font-medium">Nenhum container encontrado</p>
              <p className="text-sm">Os containers aparecerão aqui quando os sensores enviarem dados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Página de Rotas
function RoutesPage() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [optimizedRoute, setOptimizedRoute] = useState(null)

  const fetchRoutes = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:5001/api/routes')
      if (response.data.success) {
        setRoutes(response.data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar rotas:', error)
    } finally {
      setLoading(false)
    }
  }

  const optimizeRoute = async () => {
    setOptimizing(true)
    try {
      const response = await axios.post('http://localhost:5001/api/optimize-route', {
        fill_threshold: 75
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      // Sempre definir a rota otimizada, mesmo se não houver containers >= 75%
      setOptimizedRoute(response.data)
      
      if (response.data.success) {
        console.log('Rota otimizada com sucesso:', response.data)
      } else {
        console.log('Nenhuma rota encontrada:', response.data.message)
      }
    } catch (error) {
      console.error('Erro ao otimizar rota:', error)
      setOptimizedRoute({
        success: false,
        message: 'Erro ao conectar com o servidor',
        route: [],
        containers: []
      })
    } finally {
      setOptimizing(false)
    }
  }

  useEffect(() => {
    fetchRoutes()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rotas</h1>
          <p className="text-gray-600">Otimização e gerenciamento de rotas de coleta</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={fetchRoutes} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={optimizeRoute} disabled={optimizing} className="bg-green-500 text-white hover:bg-green-600">
            <RouteIcon className={`w-4 h-4 mr-2 ${optimizing ? 'animate-spin' : ''}`} />
            {optimizing ? 'Otimizando...' : 'Rota Automática'}
          </Button>
        </div>
      </div>

      {optimizedRoute && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Rota Otimizada</h3>
              <Badge variant="default">
                {optimizedRoute.containers_count} containers
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <RouteIcon className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Distância Total</p>
                    <p className="text-lg font-semibold text-gray-900">{optimizedRoute.total_distance} km</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Tempo Estimado</p>
                    <p className="text-lg font-semibold text-gray-900">{optimizedRoute.estimated_time} min</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Prioridade Alta</p>
                    <p className="text-lg font-semibold text-gray-900">{optimizedRoute.summary.high_priority}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Sequência da Rota:</h4>
              {optimizedRoute.route.map((point, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{point.order}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {point.type === 'depot' ? (
                        <Home className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-blue-600" />
                      )}
                      <span className="font-medium text-gray-900">{point.name}</span>
                      {point.type === 'container' && (
                        <Badge variant={point.priority === 'high' ? 'destructive' : 'secondary'}>
                          {point.fill_level}%
                        </Badge>
                      )}
                    </div>
                    {point.location && (
                      <p className="text-sm text-gray-600">{point.location}</p>
                    )}
                  </div>
                  {point.type === 'container' && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Bateria: {point.battery_level}%</p>
                      <p className="text-sm text-gray-600">{point.container_type}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Carregando rotas...</span>
            </div>
          ) : routes.length > 0 ? (
            <div className="space-y-4">
              {routes.map((route) => (
                <div key={route.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{route.name}</h3>
                      <p className="text-sm text-gray-600">{route.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{route.status}</Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {route.total_distance} km • {route.estimated_time} min
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <RouteIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="font-medium">Nenhuma rota encontrada</p>
              <p className="text-sm">Clique em "Rota Automática" para gerar uma rota otimizada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default App
