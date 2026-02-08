import { FileText, Package, TestTube } from 'lucide-react';

interface MainSelectionProps {
  onSelectType: (type: 'reglamento' | 'producto' | 'ensayo') => void;
}

export function MainSelection({ onSelectType }: MainSelectionProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Selecciona el tipo de cotización
          </h1>
          <p className="text-gray-600 text-lg">
            Elige una de las siguientes opciones para iniciar tu cotización
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <button
            onClick={() => onSelectType('reglamento')}
            className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 text-center group hover:scale-105"
          >
            <div className="bg-[#1e40af] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#1e3a8a] transition-colors">
              <FileText size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Reglamento</h2>
            <p className="text-gray-600">
              Cotizaciones relacionadas con normativas y regulaciones
            </p>
          </button>

          <button
            onClick={() => onSelectType('producto')}
            className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 text-center group hover:scale-105"
          >
            <div className="bg-[#1e40af] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#1e3a8a] transition-colors">
              <Package size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Producto</h2>
            <p className="text-gray-600">
              Selecciona productos de nuestro catálogo
            </p>
          </button>

          <button
            onClick={() => onSelectType('ensayo')}
            className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 text-center group hover:scale-105"
          >
            <div className="bg-[#1e40af] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#1e3a8a] transition-colors">
              <TestTube size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Ensayo</h2>
            <p className="text-gray-600">
              Ensayos de laboratorio y pruebas especializadas
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
