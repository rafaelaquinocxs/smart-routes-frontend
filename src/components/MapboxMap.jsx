import React, { useEffect, useRef, useState } from 'react'

function MapboxMap({ containers = [] }) {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  const [lng, setLng] = useState(-51.2065)
  const [lat, setLat] = useState(-29.2648)
  const [zoom, setZoom] = useState(12)

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    // Criar mapa usando Leaflet (OpenStreetMap) em vez do Mapbox
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      setTimeout(() => {
        if (window.L && mapContainer.current && !mapInstance.current) {
          try {
            // Criar mapa apenas se não existir
            mapInstance.current = window.L.map(mapContainer.current).setView([lat, lng], zoom)
            
            // Adicionar tiles do OpenStreetMap
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance.current)

            // Atualizar coordenadas quando o mapa se move
            mapInstance.current.on('moveend', () => {
              const center = mapInstance.current.getCenter()
              setLng(center.lng.toFixed(4))
              setLat(center.lat.toFixed(4))
              setZoom(mapInstance.current.getZoom())
            })

            console.log('Mapa OpenStreetMap carregado com sucesso!')
          } catch (error) {
            console.error('Erro ao criar mapa:', error)
          }
        }
      }, 500)
    }
    
    if (!document.querySelector('script[src*="leaflet"]')) {
      document.head.appendChild(script)
    } else if (window.L && !mapInstance.current) {
      script.onload()
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  // Atualizar marcadores quando containers mudarem
  useEffect(() => {
    if (!mapInstance.current || !window.L) return

    // Limpar marcadores existentes
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof window.L.Marker) {
        mapInstance.current.removeLayer(layer)
      }
    })

    // Adicionar novos marcadores
    const bounds = []
    containers.forEach(container => {
      if (container.latitude && container.longitude) {
        const lat = parseFloat(container.latitude)
        const lng = parseFloat(container.longitude)
        
        // Determinar cor do marcador baseado no status
        let color = '#6B7280' // Cinza padrão
        if (container.fill_level >= 90) color = '#EF4444' // Vermelho
        else if (container.fill_level >= 70) color = '#F59E0B' // Laranja
        else if (container.fill_level >= 40) color = '#3B82F6' // Azul
        else if (container.fill_level > 0) color = '#10B981' // Verde

        // Criar ícone customizado
        const customIcon = window.L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })

        const marker = window.L.marker([lat, lng], { icon: customIcon })
          .addTo(mapInstance.current)
          .bindPopup(`
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1F2937;">${container.name}</h3>
              <div style="font-size: 14px; color: #4B5563; line-height: 1.4;">
                <p style="margin: 4px 0;"><strong>UID:</strong> ${container.uid}</p>
                <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${container.status || 'Sem dados'}</span></p>
                <p style="margin: 4px 0;"><strong>Nível:</strong> ${container.fill_level || 0}%</p>
                <p style="margin: 4px 0;"><strong>Coordenadas:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
                ${container.latest_data ? `
                  <hr style="margin: 8px 0; border: none; border-top: 1px solid #E5E7EB;">
                  <p style="margin: 4px 0;"><strong>Bateria:</strong> ${container.latest_data.battery_pct || 'N/A'}%</p>
                  <p style="margin: 4px 0;"><strong>RSSI:</strong> ${container.latest_data.rssi || 'N/A'} dBm</p>
                  <p style="margin: 4px 0;"><strong>Distância:</strong> ${container.latest_data.distance || 'N/A'} cm</p>
                ` : ''}
              </div>
            </div>
          `)

        bounds.push([lat, lng])
      }
    })

    // Ajustar zoom para mostrar todos os containers
    if (bounds.length > 0) {
      mapInstance.current.fitBounds(bounds, { padding: [20, 20] })
    }

  }, [containers])

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div ref={mapContainer} style={{ height: '600px', width: '100%' }} />
      
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '12px',
        fontSize: '14px',
        zIndex: 1000
      }}>
        <div style={{ fontWeight: '500', marginBottom: '4px' }}>Coordenadas</div>
        <div>Longitude: {lng}</div>
        <div>Latitude: {lat}</div>
        <div>Zoom: {zoom}</div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '12px',
        zIndex: 1000
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
            <span>Baixo (&lt;40%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#6B7280', marginRight: '8px' }}></div>
            <span>Sem dados</span>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '8px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        Containers: {containers.length}
      </div>
    </div>
  )
}

export default MapboxMap