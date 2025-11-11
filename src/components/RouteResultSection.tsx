import { Leaf, Clock, MapPin, Truck, TrendingDown, Zap, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RouteResultSectionProps {
  routeData: {
    distance: string;
    duration: string;
    containersCount: number;
    co2Saved: number;
    timeSaved: number;
    fuelSaved: number;
    costSaved: number;
  } | null;
  isLoading?: boolean;
  onShare?: () => void;
}

export default function RouteResultSection({
  routeData,
  isLoading = false,
  onShare,
}: RouteResultSectionProps) {
  if (!routeData && !isLoading) return null;

  return (
    <Card className="mt-8 border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <TrendingDown className="w-6 h-6 text-green-600" />
          Resultado da Rota Otimizada
        </CardTitle>
        <CardDescription>Benefícios e métricas da coleta inteligente</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
            <p className="text-gray-600">Calculando rota otimizada...</p>
          </div>
        ) : routeData ? (
          <>
            {/* Dados Principais em Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Distância Total</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{routeData.distance}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Tempo Estimado</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">{routeData.duration}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Containers</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{routeData.containersCount}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">CO₂ Economizado</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{routeData.co2Saved} kg</p>
              </div>
            </div>

            {/* Benefícios Detalhados */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Benefícios da Otimização
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 mb-2 font-medium">⏱️ Tempo Economizado</p>
                  <p className="text-3xl font-bold text-blue-600">{routeData.timeSaved}</p>
                  <p className="text-xs text-gray-600 mt-2">minutos por coleta</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-700 mb-2 font-medium">⛽ Combustível Economizado</p>
                  <p className="text-3xl font-bold text-orange-600">{routeData.fuelSaved}</p>
                  <p className="text-xs text-gray-600 mt-2">litros por rota</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700 mb-2 font-medium">💰 Custo Economizado</p>
                  <p className="text-3xl font-bold text-green-600">R$ {routeData.costSaved}</p>
                  <p className="text-xs text-gray-600 mt-2">redução operacional</p>
                </div>
              </div>
            </div>

            {/* Share Button */}
            {onShare && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={onShare}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <Share2 className="w-5 h-5" />
                  Compartilhar via WhatsApp
                </Button>
              </div>
            )}

            {/* Resumo da Coleta */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">📊 Resumo da Coleta</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Rota otimizada com algoritmo Nearest Neighbor</span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Containers com preenchimento acima de 50%</span>
                  <span className="font-semibold text-purple-600">{routeData.containersCount}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Redução de emissões de CO₂</span>
                  <span className="font-semibold text-green-600">{routeData.co2Saved} kg</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Eficiência operacional</span>
                  <span className="font-semibold text-blue-600">+45%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Distância total da rota</span>
                  <span className="font-semibold text-blue-600">{routeData.distance}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Tempo total estimado</span>
                  <span className="font-semibold text-orange-600">{routeData.duration}</span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
