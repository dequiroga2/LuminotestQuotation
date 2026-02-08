import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { MainSelection } from './components/MainSelection';
import { ReglamentoSelection } from './components/ReglamentoSelection';
import { ProductoSelection } from './components/ProductoSelection';
import { EnsayoSelection } from './components/EnsayoSelection';

type ViewType = 'main' | 'reglamento' | 'producto' | 'ensayo';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('main');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-[#1e40af] text-xl font-semibold">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleSelectType = (type: 'reglamento' | 'producto' | 'ensayo') => {
    setCurrentView(type);
  };

  const handleBack = () => {
    setCurrentView('main');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {currentView === 'main' && <MainSelection onSelectType={handleSelectType} />}
      {currentView === 'reglamento' && <ReglamentoSelection onBack={handleBack} />}
      {currentView === 'producto' && <ProductoSelection onBack={handleBack} />}
      {currentView === 'ensayo' && <EnsayoSelection onBack={handleBack} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
