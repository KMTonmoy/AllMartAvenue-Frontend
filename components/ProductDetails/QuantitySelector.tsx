import React from 'react';
import { Product } from '@/types/product';

interface QuantitySelectorProps {
  product: Product;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  product,
  quantity,
  onIncrement,
  onDecrement
}) => {
  return (
    <div className="flex items-center space-x-6">
      {/* Quantity Selector */}
      <div className="flex items-center border border-gray-300 rounded-xl bg-white">
        <button
          onClick={onDecrement}
          disabled={quantity <= 1}
          className={`p-3 transition-colors ${quantity <= 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
        >
          -
        </button>
        <span className="px-6 py-3 border-l border-r border-gray-300 min-w-16 text-center font-semibold text-gray-900">
          {quantity}
        </span>
        <button
          onClick={onIncrement}
          disabled={quantity >= product.stock}
          className={`p-3 transition-colors ${quantity >= product.stock
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
        >
          +
        </button>
      </div>

      {/* Stock Info */}
      <div className="text-sm">
        <span className="text-gray-600">Stock: </span>
        <span className={`font-semibold ${product.stock > 10 ? 'text-green-600' :
            product.stock > 5 ? 'text-yellow-600' : 'text-red-600'
          }`}>
          {product.stock} available
        </span>
      </div>
    </div>
  );
};

export default QuantitySelector;