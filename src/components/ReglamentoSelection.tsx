import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface ReglamentoSelectionProps {
  onBack: () => void;
}

export function ReglamentoSelection({ onBack }: ReglamentoSelectionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = ['RETILAP', 'RETIE', 'OTROS'];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
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
            Selecciona el Reglamento
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Elige el tipo de reglamento para tu cotización
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`relative p-8 rounded-xl border-2 transition-all duration-300 ${
                  selectedOption === option
                    ? 'border-[#1e40af] bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-[#1e40af] hover:shadow-md'
                }`}
              >
                {selectedOption === option && (
                  <div className="absolute -top-3 -right-3">
                    <CheckCircle2 className="text-[#1e40af]" size={32} fill="#1e40af" />
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800">{option}</h3>
                </div>
              </button>
            ))}
          </div>

          {selectedOption && (
            <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
              <p className="text-green-800 text-center font-medium">
                Has seleccionado: <span className="font-bold">{selectedOption}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
