import React from 'react';
import { Check } from 'lucide-react';
import { Product } from '@/types/product';

interface ColorSelectorProps {
  product: Product;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  product,
  selectedColor,
  setSelectedColor
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Color</h3>
        <span className="text-sm text-gray-500">
          {product.colors.find(color => color.value === selectedColor)?.name}
        </span>
      </div>
      <div className="flex space-x-3">
        {product.colors.map((color, index) => (
          <button
            key={index}
            onClick={() => setSelectedColor(color.value)}
            className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200 ${selectedColor === color.value
                ? 'border-gray-900 shadow-lg scale-110'
                : 'border-gray-300 hover:border-gray-400'
              }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          >
            {selectedColor === color.value && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;