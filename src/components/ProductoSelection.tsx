import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { productos } from '../data/products';

interface ProductoSelectionProps {
  onBack: () => void;
}

export function ProductoSelection({ onBack }: ProductoSelectionProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const toggleProduct = (product: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(product)) {
      newSelected.delete(product);
    } else {
      newSelected.add(product);
    }
    setSelectedProducts(newSelected);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-[#1e40af] hover:text-[#1e3a8a] mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Volver</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Selecciona los Productos
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Elige uno o varios productos para tu cotización
          </p>

          {selectedProducts.size > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <p className="text-blue-800 text-center font-medium">
                {selectedProducts.size} producto{selectedProducts.size !== 1 ? 's' : ''} seleccionado{selectedProducts.size !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
            {productos.map((producto) => (
              <button
                key={producto}
                onClick={() => toggleProduct(producto)}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedProducts.has(producto)
                    ? 'border-[#1e40af] bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-[#1e40af] hover:shadow-sm'
                }`}
              >
                {selectedProducts.has(producto) && (
                  <div className="absolute -top-2 -right-2">
                    <CheckCircle2 className="text-[#1e40af]" size={24} fill="#1e40af" />
                  </div>
                )}
                <h3 className="text-sm font-medium text-gray-800 pr-6">{producto}</h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
