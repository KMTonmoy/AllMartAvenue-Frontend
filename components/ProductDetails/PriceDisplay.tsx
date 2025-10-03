import React from 'react';
import { TbCurrencyTaka } from 'react-icons/tb';
import { Product } from '@/types/product';

interface PriceDisplayProps {
  product: Product;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ product }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
      <div className="flex items-baseline space-x-3">
        <span className="text-3xl font-bold text-gray-900 flex items-center">
          <TbCurrencyTaka className="mr-1" />
          {product.price}
        </span>
        <span className="text-xl text-gray-500 line-through flex items-center">
          <TbCurrencyTaka className="mr-1" />
          {product.originalPrice}
        </span>
      </div>
      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
        Save {product.discount}%
      </span>
    </div>
  );
};

export default PriceDisplay;