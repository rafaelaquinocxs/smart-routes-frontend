import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/AppLayout';
import { trpc } from '@/lib/trpc';
import { Navigation, AlertCircle } from 'lucide-react';
import { APP_LOGO, APP_TITLE } from '@/const';
import RouteResultSection from '@/components/RouteResultSection';
import ContainerPopup from '@/components/ContainerPopup';

// Caxias do Sul coordinates
const CAXIAS_CENTER = {
  latitude: -29.1642,
  longitude: -51.1899,
};

// Codeca (Garagem) coordinates - Ponto Zero
const CODECA_GARAGE = {
  latitude: -29.1750,
  longitude: -51.1850,
  name: 'Codeca (Garagem)',
};

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyATsBgMVQ7NasoPt7RgTK_ERjUC8o0d0qQ';

export default function MapPage() {
  const [, navigate] = useLocation();
  const { data: containers = [] } = trpc.containers.list.useQuery();
  const { data: readings = [] } = trpc.containers.readings.useQuery();
  const calculateRouteMutation = trpc.containers.calculateRoute.useMutation();
  const saveRouteMutation = trpc.containers.saveRoute.useMutation();
  const [selectedContainer, setSelectedContainer] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<Map<number, maplibregl.Marker>>(new Map());
  const routeSource = useRef<boolean>(false);
  const popup = useRef<maplibregl.Popup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      } as any,
      center: [CAXIAS_CENTER.longitude, CAXIAS_CENTER.latitude],
      zoom: 13,
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Add markers when containers change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current.clear();

    // Add Codeca (Garage) marker
    const codekaEl = document.createElement('div');
    codekaEl.style.width = '50px';
    codekaEl.style.height = '50px';
    codekaEl.style.backgroundColor = '#1f2937';
    codekaEl.style.borderRadius = '50%';
    codekaEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5), 0 0 0 3px #10b981';
    codekaEl.style.display = 'flex';
    codekaEl.style.alignItems = 'center';
    codekaEl.style.justifyContent = 'center';
    codekaEl.style.color = '#10b981';
    codekaEl.style.fontSize = '20px';
    codekaEl.style.fontWeight = 'bold';
    codekaEl.style.cursor = 'pointer';
    codekaEl.style.border = '3px solid #10b981';
    codekaEl.textContent = 'G';
    codekaEl.title = 'Codeca - Garagem (Ponto Zero)';

    new maplibregl.Marker({ element: codekaEl })
      .setLngLat([CODECA_GARAGE.longitude, CODECA_GARAGE.latitude])
      .addTo(map.current!);

    // Add new markers
    containers.forEach((container: any) => {
      const reading = getLatestReading(container.id);
      const level = reading?.level ?? 0;
      const color = getMarkerColor(level);

      const el = document.createElement('div');
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.backgroundColor = color;
      el.style.borderRadius = '50%';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = 'white';
      el.style.fontSize = '13px';
      el.style.fontWeight = 'bold';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid white';
      el.textContent = `${level}%`;

      el.addEventListener('click', (e) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setPopupPosition({
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
        setSelectedContainer(container);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([parseFloat(container.longitude), parseFloat(container.latitude)])
        .addTo(map.current!);

      markers.current.set(container.id, marker);
    });
  }, [containers, readings]);

  // Helper functions
  const getLatestReading = (containerId: number) => {
    return readings.find((r: any) => r.containerId === containerId);
  };

  const shareRoute = () => {
    if (!resultData) return;
    const message = `Rota Otimizada de Coleta - Distancia: ${resultData.distance}, Tempo: ${resultData.duration}, Containers: ${resultData.containersCount}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getMarkerColor = (level: number) => {
    if (level >= 75) return '#ef4444';
    if (level >= 50) return '#f59e0b';
    return '#10b981';
  };

  const containersAbove50 = containers.filter((c: any) => {
    const reading = getLatestReading(c.id);
    return (reading?.level ?? 0) >= 50;
  });

  const calculateRoute = async () => {
    if (containersAbove50.length === 0) {
      alert('Nenhum container com mais de 50% de preenchimento');
      return;
    }

    setIsLoadingRoute(true);
    try {
      const result = await calculateRouteMutation.mutateAsync({
        containers: containersAbove50,
      });

      if (result && result.distance && result.duration) {
        setRouteInfo({ distance: result.distance, duration: result.duration });

        // Draw route on map
        if (result.polylinePoints && result.polylinePoints.length > 0) {
          const decodedPath = result.polylinePoints.map((p: any) => ({ lat: p[1], lng: p[0] }));

          // Remove existing route source if any
          if (routeSource.current && map.current?.getSource('route')) {
            map.current.removeLayer('route');
            map.current.removeSource('route');
          }

          // Add route to map
          map.current?.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: decodedPath.map(p => [p.lng, p.lat]),
              },
              properties: {},
            } as any,
          });

          map.current?.addLayer({
            id: 'route-glow',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': '#3b82f6',
              'line-width': 8,
              'line-opacity': 0.3,
              'line-blur': 4,
            },
          });

          map.current?.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': '#3b82f6',
              'line-width': 5,
              'line-opacity': 0.9,
            },
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
          });

          routeSource.current = true;

          // Calculate result data
          const co2Saved = result.distance.replace(' km', '') ? parseFloat(result.distance.replace(' km', '')) * 0.25 : 0;
          const timeSaved = containersAbove50.length * 5;
          const fuelSaved = result.distance.replace(' km', '') ? parseFloat(result.distance.replace(' km', '')) * 0.08 : 0;
          const costSaved = fuelSaved * 6;

          setResultData({
            distance: result.distance,
            duration: result.duration,
            containersCount: containersAbove50.length,
            co2Saved: co2Saved.toFixed(2),
            timeSaved,
            fuelSaved: fuelSaved.toFixed(2),
            costSaved: costSaved.toFixed(2),
          });

          // Save route to database
          const distanceNum = parseFloat(result.distance.replace(' km', ''));
          const durationNum = parseInt(result.duration.replace(' min', ''));
          saveRouteMutation.mutate({
            totalDistance: result.totalDistance || distanceNum,
            totalDuration: result.totalDuration || durationNum,
            containersCount: containersAbove50.length,
            containerIds: containersAbove50.map((c: any) => c.id),
            polylinePoints: result.polylinePoints || [],
            fuelSaved: parseFloat(String(fuelSaved)),
            co2Saved: parseFloat(String(co2Saved)),
            costSaved: parseFloat(String(costSaved)),
            timeSaved: timeSaved,
            efficiencyGain: 45,
          });

          // Fit bounds to route
          const bounds = new maplibregl.LngLatBounds();
          decodedPath.forEach((p: any) => bounds.extend([p.lng, p.lat]));
          map.current?.fitBounds(bounds, { padding: 50 });
        }
      } else {
        alert('Erro ao calcular rota');
      }
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      alert('Erro ao calcular rota');
    } finally {
      setIsLoadingRoute(false);
    }
  };



  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mapa em Tempo Real</h1>
          <p className="text-gray-600">Visualize a localização de todos os containers em Caxias do Sul - Clique em um container para ver detalhes</p>
        </div>

        {/* Create Route Button */}
        <div className="mb-6 flex gap-4 items-center flex-wrap">
          <Button
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={calculateRoute}
            disabled={isLoadingRoute || containersAbove50.length === 0}
          >
            <Navigation className="h-4 w-4" />
            {isLoadingRoute ? 'Calculando rota...' : 'Criar Rota'}
          </Button>
          {containersAbove50.length > 0 && (
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              {containersAbove50.length} container(s) com mais de 50% de preenchimento
            </div>
          )}
        </div>

        {/* Map Container - Full Width */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mapa de Containers</CardTitle>
            <CardDescription>Localização dos containers em Caxias do Sul</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div ref={mapContainer} style={{ height: '900px', width: '100%' }} />
          </CardContent>
        </Card>

      {/* Container Popup - Floating */}
      {selectedContainer && popupPosition && (
        <ContainerPopup
          container={selectedContainer}
          reading={getLatestReading(selectedContainer.id)}
          onClose={() => {
            setSelectedContainer(null);
            setPopupPosition(null);
          }}
          position={popupPosition}
        />
      )}

        {/* Scroll indicator */}
        {resultData && (
          <div className="flex justify-center mb-4 animate-bounce">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Resultado da rota abaixo ↓</p>
              <div className="text-2xl text-blue-600">↓</div>
            </div>
          </div>
        )}

        {/* Route Result Section */}
        <RouteResultSection
          routeData={resultData}
          isLoading={isLoadingRoute}
          onShare={() => shareRoute()}
        />
      </div>
    </AppLayout>
  );
}
