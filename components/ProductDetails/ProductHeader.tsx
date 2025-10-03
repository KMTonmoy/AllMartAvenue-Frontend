import React from 'react';
import { Product } from '@/types/product';

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ product }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200">
          {product.productTag}
        </div>
        <div className="text-sm text-gray-500">
          SKU: <span className="font-medium text-gray-900">FASH{product._id}</span>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 leading-tight">
        {product.name}
      </h1>

      <p className="text-lg text-gray-600 leading-relaxed">
        {product.details}
      </p>
    </div>
  );
};

export default ProductHeader;