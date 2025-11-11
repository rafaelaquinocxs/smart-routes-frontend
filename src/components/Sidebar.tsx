import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  MapPin, BarChart3, LayoutDashboard, History, Menu, X, LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { 
    id: 'map', 
    label: 'Mapa', 
    path: '/map', 
    icon: MapPin,
    importance: 1
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    path: '/analytics', 
    icon: BarChart3,
    importance: 2
  },
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard,
    importance: 3
  },
  { 
    id: 'history', 
    label: 'Histórico', 
    path: '/history', 
    icon: History,
    importance: 4
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [location, navigate] = useLocation();

  const handleLogout = () => {
    // TODO: Implementar logout real
    navigate('/');
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-green-600 to-blue-600 text-white transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          {isOpen && (
            <h1 className="text-xl font-bold">Smart Routes</h1>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
                title={item.label}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 transition"
            title="Logout"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Content will be rendered here */}
      </div>
    </>
  );
}
