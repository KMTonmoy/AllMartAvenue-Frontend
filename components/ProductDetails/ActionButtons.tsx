import React from 'react';
import { ShoppingCart, Share2 } from 'lucide-react';
import { Product } from '@/types/product';

interface ActionButtonsProps {
  product: Product;
  onShare: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ product, onShare }) => {
  return (
    <div className="flex space-x-3">
      <button
        className="flex-1 bg-gray-900 text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center space-x-3 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={product.stock === 0}
      >
        <ShoppingCart className="w-5 h-5" />
        <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
      </button>

      <button
        onClick={onShare}
        className="p-4 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ActionButtons;