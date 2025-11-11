import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Leaf, Clock, MapPin, Truck, AlertCircle } from 'lucide-react';

interface RouteResultModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export default function RouteResultModal({
  isOpen,
  onClose,
  routeData,
  isLoading = false,
}: RouteResultModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl">Resultado da Rota Otimizada</CardTitle>
            <CardDescription>Dados da coleta inteligente de containers</CardDescription>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
              <p className="text-gray-600">Calculando rota otimizada...</p>
            </div>
          ) : routeData ? (
            <>
              {/* Dados Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Distância Total</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{routeData.distance}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-600">Tempo Estimado</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{routeData.duration}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Containers</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{routeData.containersCount}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">CO₂ Economizado</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{routeData.co2Saved} kg</p>
                </div>
              </div>

              {/* Dados Secundários */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Benefícios da Rota Otimizada
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Tempo Economizado</p>
                    <p className="text-xl font-bold text-blue-600">{routeData.timeSaved} min</p>
                    <p className="text-xs text-gray-500 mt-2">Comparado a rota aleatória</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Combustível Economizado</p>
                    <p className="text-xl font-bold text-orange-600">{routeData.fuelSaved} L</p>
                    <p className="text-xs text-gray-500 mt-2">Estimado para esta rota</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Custo Economizado</p>
                    <p className="text-xl font-bold text-green-600">R$ {routeData.costSaved}</p>
                    <p className="text-xs text-gray-500 mt-2">Redução operacional</p>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Resumo da Coleta</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex justify-between">
                    <span>Rota otimizada com algoritmo Nearest Neighbor</span>
                    <span className="font-medium">✓</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Containers com preenchimento acima de 50%</span>
                    <span className="font-medium">{routeData.containersCount}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Redução de emissões de CO₂</span>
                    <span className="font-medium text-green-600">{routeData.co2Saved} kg</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Eficiência operacional</span>
                    <span className="font-medium text-blue-600">+45%</span>
                  </li>
                </ul>
              </div>
            </>
          ) : null}

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Fechar
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Iniciar Coleta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
