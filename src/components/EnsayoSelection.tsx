import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ensayos } from '../data/products';

interface EnsayoSelectionProps {
  onBack: () => void;
}

export function EnsayoSelection({ onBack }: EnsayoSelectionProps) {
  const [selectedEnsayo, setSelectedEnsayo] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (ensayo: string) => {
    setSelectedEnsayo(ensayo);
    setIsOpen(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-[#1e40af] hover:text-[#1e3a8a] mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Volver</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Selecciona el Ensayo
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Elige el tipo de ensayo que necesitas
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 bg-white border-2 border-gray-300 rounded-xl text-left flex items-center justify-between hover:border-[#1e40af] transition-colors focus:outline-none focus:border-[#1e40af] focus:ring-2 focus:ring-blue-100"
              >
                <span className={selectedEnsayo ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                  {selectedEnsayo || 'Selecciona un ensayo...'}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto">
                  {ensayos.map((ensayo) => (
                    <button
                      key={ensayo}
                      onClick={() => handleSelect(ensayo)}
                      className={`w-full px-6 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        selectedEnsayo === ensayo ? 'bg-blue-50 text-[#1e40af] font-medium' : 'text-gray-700'
                      }`}
                    >
                      {ensayo}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedEnsayo && (
              <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                <p className="text-green-800 font-medium mb-2">Ensayo seleccionado:</p>
                <p className="text-gray-700">{selectedEnsayo}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
