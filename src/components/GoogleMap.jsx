import { useEffect, useRef, useState } from 'react'

// Chave da API do Google Maps
const GOOGLE_MAPS_API_KEY = 'AIzaSyATsBgMVQ7NasoPt7RgTK_ERjUC8o0d0qQ'

function GoogleMap({ containers = [] }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Carregar script do Google Maps
  useEffect(() => {
    if (window.google) {
      setIsLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry`
    script.async = true
    script.defer = true
    script.onload = () => setIsLoaded(true)
    script.onerror = () => {
      console.error('Erro ao carregar Google Maps')
      showFallbackMap()
    }
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  // Inicializar mapa quando carregado
  useEffect(() => {
    if (!isLoaded || !window.google || map.current) return

    try {
      map.current = new window.google.maps.Map(mapContainer.current, {
        center: { lat: -23.5505, lng: -46.6333 }, // São Paulo
        zoom: 12,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })
    } catch (error) {
      console.error('Erro ao inicializar Google Maps:', error)
      showFallbackMap()
    }
  }, [isLoaded])

  // Adicionar marcadores dos containers
  useEffect(() => {
    if (!map.current || !window.google || !containers.length) return

    // Limpar marcadores existentes
    markers.current.forEach(marker => marker.setMap(null))
    markers.current = []

    // Adicionar novos marcadores
    containers.forEach(container => {
      if (container.latitude && container.longitude) {
        const marker = new window.google.maps.Marker({
          position: { lat: container.latitude, lng: container.longitude },
          map: map.current,
          title: container.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: getContainerColor(container),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
          }
        })

        // Adicionar InfoWindow
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${container.name}</h3>
              <p style="margin: 4px 0; color: #666;">${container.location}</p>
              <p style="margin: 4px 0;"><strong>Tipo:</strong> ${container.container_type}</p>
              <p style="margin: 4px 0;"><strong>Status:</strong> ${container.status || 'Sem dados'}</p>
              ${container.latest_data ? `
                <p style="margin: 4px 0;"><strong>Nível:</strong> ${container.latest_data.fill_level?.toFixed(1) || 0}%</p>
                <p style="margin: 4px 0;"><strong>Bateria:</strong> ${container.latest_data.battery_pct || 0}%</p>
              ` : ''}
            </div>
          `
        })

        marker.addListener('click', () => {
          infoWindow.open(map.current, marker)
        })

        markers.current.push(marker)
      }
    })

    // Ajustar zoom para mostrar todos os marcadores
    if (markers.current.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      markers.current.forEach(marker => {
        bounds.extend(marker.getPosition())
      })
      map.current.fitBounds(bounds)
      
      // Garantir zoom mínimo
      const listener = window.google.maps.event.addListener(map.current, 'idle', () => {
        if (map.current.getZoom() > 15) map.current.setZoom(15)
        window.google.maps.event.removeListener(listener)
      })
    }
  }, [containers])

  const getContainerColor = (container) => {
    if (!container.latest_data) return '#6B7280' // Gray for no data
    
    const fillLevel = container.latest_data.fill_level
    if (fillLevel >= 90) return '#EF4444' // Red for full
    if (fillLevel >= 70) return '#F59E0B' // Yellow for high
    if (fillLevel >= 40) return '#3B82F6' // Blue for medium
    return '#10B981' // Green for low/empty
  }

  const showFallbackMap = () => {
    if (mapContainer.current) {
      mapContainer.current.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background-color: #f3f4f6; color: #6b7280;">
          <div style="text-align: center; padding: 20px;">
            <div style="width: 64px; height: 64px; margin: 0 auto 16px; background-color: #d1d5db; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <svg style="width: 32px; height: 32px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 style="font-size: 18px; font-weight: 500; margin-bottom: 8px;">Mapa dos Containers</h3>
            <p style="font-size: 14px; margin-bottom: 8px;">Visualização geográfica dos containers</p>
            <p style="font-size: 12px; color: #9ca3af;">Google Maps será carregado aqui</p>
            <div style="margin-top: 16px; padding: 12px; background-color: #dbeafe; border-radius: 8px;">
              <p style="font-size: 12px; color: #1e40af;">
                <strong>Containers Monitorados:</strong><br/>
                ${containers.map(c => `• ${c.name} (${c.status || 'Sem dados'})`).join('<br/>')}
              </p>
            </div>
          </div>
        </div>
      `
    }
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
      
      {/* Legenda */}
      {isLoaded && map.current && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '12px'
        }}>
          <div style={{ fontWeight: '500', marginBottom: '8px', fontSize: '14px' }}>Legenda</div>
          <div style={{ fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444', marginRight: '8px' }}></div>
              <span>Cheio (≥90%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B', marginRight: '8px' }}></div>
              <span>Alto (70-89%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3B82F6', marginRight: '8px' }}></div>
              <span>Médio (40-69%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981', marginRight: '8px' }}></div>
              <span>Baixo (<40%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#6B7280', marginRight: '8px' }}></div>
              <span>Sem dados</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoogleMap
