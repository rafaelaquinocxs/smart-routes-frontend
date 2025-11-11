import { X, MapPin, Battery, Zap, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContainerPopupProps {
  container: any;
  reading: any;
  onClose: () => void;
  position: { x: number; y: number };
}

export default function ContainerPopup({
  container,
  reading,
  onClose,
  position,
}: ContainerPopupProps) {
  const level = reading?.level ?? 0;
  const battery = reading?.battery ?? 0;
  const rssi = reading?.rssi ?? 0;

  const getStatusColor = (level: number) => {
    if (level >= 75) return 'text-red-600 bg-red-50';
    if (level >= 50) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = (level: number) => {
    if (level >= 75) return 'Crítico';
    if (level >= 50) return 'Médio';
    return 'Baixo';
  };

  return (
    <div
      className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 z-50 w-80 p-0 overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
        marginTop: '-16px',
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 flex items-center justify-between">
        <h3 className="font-bold text-lg">{container.name}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Status Badge */}
        <div className={`p-3 rounded-lg ${getStatusColor(level)}`}>
          <p className="text-sm font-medium">Status: {getStatusText(level)}</p>
        </div>

        {/* Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Preenchimento</span>
            <span className="text-lg font-bold text-blue-600">{level}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                level >= 75 ? 'bg-red-500' : level >= 50 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${level}%` }}
            />
          </div>
        </div>

        {/* Battery */}
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <Battery className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Bateria</span>
          </div>
          <span className="text-sm font-bold text-yellow-600">{battery}%</span>
        </div>

        {/* RSSI */}
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Sinal (RSSI)</span>
          </div>
          <span className="text-sm font-bold text-purple-600">{rssi} dBm</span>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <MapPin className="h-4 w-4 text-gray-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-600">Coordenadas</p>
            <p className="text-xs text-gray-700">
              {parseFloat(container.latitude).toFixed(4)}, {parseFloat(container.longitude).toFixed(4)}
            </p>
          </div>
        </div>

        {/* Last Reading */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          Última leitura: {reading?.timestamp ? new Date(reading.timestamp).toLocaleTimeString('pt-BR') : 'N/A'}
        </div>
      </div>

      {/* Arrow pointer */}
      <div
        className="absolute bottom-0 left-1/2 transform translate-y-full -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
        }}
      />
    </div>
  );
}
