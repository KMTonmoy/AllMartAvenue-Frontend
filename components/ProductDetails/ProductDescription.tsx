import React from 'react';
import { Product } from '@/types/product';

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 leading-relaxed mb-6">
          {product.description}
        </p>
        <ul className="text-gray-600 space-y-2">
          {product.features?.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductDescription;