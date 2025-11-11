import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { APP_LOGO, APP_TITLE } from '@/const';
import { 
  ArrowRight, MapPin, TrendingUp, Zap, Shield, Users, BarChart3, 
  Leaf, Droplet, Wind, Truck, Clock, DollarSign 
} from 'lucide-react';

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="Logo" className="h-10 w-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Smart Routes
            </span>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-green-50 py-32 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Otimize Suas Rotas de Coleta com <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Smart Routes</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Plataforma inteligente que otimiza rotas de coleta em tempo real, reduz custos operacionais em até 45% e economiza combustível enquanto protege o meio ambiente.
              </p>
              <div className="flex gap-4 mb-8">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition"
                  onClick={() => navigate('/map')}
                >
                  Acessar Plataforma <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur p-4 rounded-lg border border-gray-200">
                  <p className="text-3xl font-bold text-green-600">45%</p>
                  <p className="text-sm text-gray-600">Redução de Custos</p>
                </div>
                <div className="bg-white/80 backdrop-blur p-4 rounded-lg border border-gray-200">
                  <p className="text-3xl font-bold text-blue-600">0.52L</p>
                  <p className="text-sm text-gray-600">Combustível/Rota</p>
                </div>
                <div className="bg-white/80 backdrop-blur p-4 rounded-lg border border-gray-200">
                  <p className="text-3xl font-bold text-orange-600">1.62kg</p>
                  <p className="text-sm text-gray-600">CO₂ Economizado</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl h-96 flex items-center justify-center shadow-2xl">
                <div className="text-white text-center">
                  <MapPin className="h-32 w-32 mx-auto mb-4 opacity-80" />
                  <p className="text-2xl font-semibold">Mapa em Tempo Real</p>
                  <p className="text-sm mt-2 opacity-80">Visualize todas as rotas otimizadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Você tem um problema de coleta?
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            Muitas empresas de coleta enfrentam desafios operacionais que aumentam custos e impactam o meio ambiente
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Rotas Ineficientes', desc: 'Coletas desnecessárias e trajetos longos' },
              { icon: DollarSign, title: 'Custos Altos', desc: 'Combustível e tempo desperdiçados' },
              { icon: Wind, title: 'Impacto Ambiental', desc: 'Emissões de CO₂ desnecessárias' },
              { icon: Droplet, title: 'Containers Cheios', desc: 'Transbordamento e sujeira' },
              { icon: Clock, title: 'Falta de Visibilidade', desc: 'Sem dados em tempo real' },
              { icon: Zap, title: 'Operações Manuais', desc: 'Processos lentos e propensos a erros' },
            ].map((problem, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-gradient-to-br from-green-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <problem.icon className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{problem.title}</h3>
                <p className="text-gray-600 text-sm">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            A Solução Smart Routes
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              { 
                color: 'from-pink-500 to-red-500',
                title: 'Otimização de Rotas',
                desc: 'Algoritmos inteligentes calculam as rotas mais eficientes, reduzindo distância e tempo',
                icon: MapPin
              },
              { 
                color: 'from-purple-500 to-pink-500',
                title: 'Dados em Tempo Real',
                desc: 'Monitore containers, combustível economizado e emissões em tempo real',
                icon: BarChart3
              },
              { 
                color: 'from-blue-500 to-cyan-500',
                title: 'Economia Comprovada',
                desc: 'Reduza custos em até 45% e economize combustível a cada rota',
                icon: DollarSign
              },
              { 
                color: 'from-green-500 to-emerald-500',
                title: 'Impacto Ambiental',
                desc: 'Reduza emissões de CO₂ e contribua para um planeta mais sustentável',
                icon: Leaf
              },
            ].map((solution, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${solution.color} p-8 rounded-2xl text-white shadow-lg hover:shadow-xl transition`}>
                <solution.icon className="h-12 w-12 mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-3">{solution.title}</h3>
                <p className="text-white/90">{solution.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Recursos Principais
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'Mapa em Tempo Real', desc: 'Visualize todos os containers e rotas em um mapa interativo' },
              { icon: BarChart3, title: 'Analytics Executiva', desc: 'Dashboard com dados ESG, economia e simulações' },
              { icon: TrendingUp, title: 'Otimização de Rotas', desc: 'Algoritmos inteligentes para rotas mais eficientes' },
              { icon: Zap, title: 'Alertas Automáticos', desc: 'Notificações em tempo real de containers cheios' },
              { icon: Users, title: 'Gerenciamento de Equipes', desc: 'Organize e acompanhe equipes de coleta' },
              { icon: Shield, title: 'Segurança de Dados', desc: 'Criptografia de ponta a ponta e conformidade' },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:shadow-lg transition group">
                <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
                  <feature.icon className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Benefícios para Sua Empresa
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                Redução de Custos
              </h3>
              <ul className="space-y-3">
                {[
                  'Otimize rotas com base em dados reais',
                  'Reduza viagens desnecessárias em 40%',
                  'Economize 0.52L de combustível por rota',
                  'Aumente eficiência operacional em 45%',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Leaf className="h-8 w-8 text-green-600" />
                Impacto Ambiental
              </h3>
              <ul className="space-y-3">
                {[
                  'Reduza 1.62kg de CO₂ por rota',
                  'Economize árvores e recursos naturais',
                  'Contribua para sustentabilidade',
                  'Relatórios ESG automatizados',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Otimizar Suas Rotas?
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Comece agora e veja como Smart Routes pode transformar suas operações de coleta
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6 font-semibold shadow-lg"
              onClick={() => navigate('/analytics')}
            >
              Ver Analytics
            </Button>
            <Button
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 font-semibold shadow-lg"
              onClick={() => navigate('/map')}
            >
              Testar Mapa
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 font-semibold"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Smart Routes</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Carreiras</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Recursos</a></li>
                <li><a href="#" className="hover:text-white">Preços</a></li>
                <li><a href="#" className="hover:text-white">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Documentação</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Termos</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 Smart Routes. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
