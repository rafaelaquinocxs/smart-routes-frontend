import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { MapPin, Loader2 } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://shrouded-brook-92780-0986488286e3.herokuapp.com/api'

function AddContainerModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    uid: '',
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    container_type: 'Orgânico',
    max_distance: 100,
    min_distance: 10
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validar campos obrigatórios
      if (!formData.uid || !formData.name) {
        setError('UID e Nome são obrigatórios')
        return
      }

      // Preparar dados para envio
      const submitData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        max_distance: parseInt(formData.max_distance),
        min_distance: parseInt(formData.min_distance)
      }

      const response = await axios.post(`${API_BASE_URL}/containers`, submitData)
      
      if (response.data.success) {
        onSuccess()
        handleClose()
      } else {
        setError(response.data.error || 'Erro ao criar container')
      }
    } catch (error) {
      console.error('Erro ao criar container:', error)
      setError(error.response?.data?.error || 'Erro ao criar container')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      uid: '',
      name: '',
      location: '',
      latitude: '',
      longitude: '',
      container_type: 'Orgânico',
      max_distance: 100,
      min_distance: 10
    })
    setError('')
    onClose()
  }

  const geocodeAddress = async () => {
    if (!formData.location) return

    try {
      setLoading(true)
      // Simulação de geocodificação - em produção usar Google Maps Geocoding API
      // Por enquanto, vamos usar coordenadas de São Paulo como exemplo
      const mockCoordinates = {
        'São Paulo': { lat: -23.5505, lng: -46.6333 },
        'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
        'Belo Horizonte': { lat: -19.9167, lng: -43.9345 }
      }

      const location = Object.keys(mockCoordinates).find(key => 
        formData.location.toLowerCase().includes(key.toLowerCase())
      )

      if (location) {
        const coords = mockCoordinates[location]
        setFormData(prev => ({
          ...prev,
          latitude: coords.lat.toString(),
          longitude: coords.lng.toString()
        }))
      } else {
        // Coordenadas padrão de São Paulo
        setFormData(prev => ({
          ...prev,
          latitude: '-23.5505',
          longitude: '-46.6333'
        }))
      }
    } catch (error) {
      console.error('Erro na geocodificação:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Container</DialogTitle>
          <DialogDescription>
            Preencha as informações do container para adicionar ao sistema de monitoramento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="uid">UID do Container *</Label>
              <Input
                id="uid"
                placeholder="ex: CONT001"
                value={formData.uid}
                onChange={(e) => handleInputChange('uid', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="ex: Container Praça Central"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <div className="flex space-x-2">
              <Input
                id="location"
                placeholder="ex: Rua das Flores, 123 - Centro"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={geocodeAddress}
                disabled={!formData.location || loading}
              >
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="ex: -23.5505"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="ex: -46.6333"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="container_type">Tipo de Container</Label>
            <Select value={formData.container_type} onValueChange={(value) => handleInputChange('container_type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Orgânico">Orgânico</SelectItem>
                <SelectItem value="Seletivo">Seletivo</SelectItem>
                <SelectItem value="Misto">Misto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_distance">Distância Vazio (cm)</Label>
              <Input
                id="max_distance"
                type="number"
                min="10"
                max="200"
                value={formData.max_distance}
                onChange={(e) => handleInputChange('max_distance', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_distance">Distância Cheio (cm)</Label>
              <Input
                id="min_distance"
                type="number"
                min="5"
                max="100"
                value={formData.min_distance}
                onChange={(e) => handleInputChange('min_distance', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Adicionar Container
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddContainerModal

