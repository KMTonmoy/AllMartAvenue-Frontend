'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Copy } from 'lucide-react';
import { Product } from '@/types/product';
import Breadcrumb from '@/components/ProductDetails/Breadcrumb';
import ProductImageGallery from '@/components/ProductDetails/ProductImageGallery';
import ProductHeader from '@/components/ProductDetails/ProductHeader';
import PriceDisplay from '@/components/ProductDetails/PriceDisplay';
import ColorSelector from '@/components/ProductDetails/ColorSelector';
import QuantitySelector from '@/components/ProductDetails/QuantitySelector';
import ActionButtons from '@/components/ProductDetails/ActionButtons';
import ServiceFeatures from '@/components/ProductDetails/ServiceFeatures';
import ProductDescription from '@/components/ProductDetails/ProductDescription';

const ProductDetails: React.FC = () => {
  const params = useParams();
  const productId = params.id as string;

  const [selectedColor, setSelectedColor] = useState<string>('#1488CC');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product from API using the ID from URL
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/products/${productId}`);
        const productData = response.data;
        setCurrentProduct(productData);
        setSelectedColor(productData.colors?.[0]?.value || '#1488CC');
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleIncrement = (): void => {
    if (currentProduct && quantity < currentProduct.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = (): void => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleShare = async (): Promise<void> => {
    if (!currentProduct) return;

    const productUrl = `${window.location.origin}/product/${currentProduct._id}`;
    try {
      await navigator.clipboard.writeText(productUrl);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = productUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading product...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !currentProduct) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">
              {error || 'Product not found'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-fade-in">
          <Copy className="w-4 h-4" />
          <span>Product link copied to clipboard!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dynamic Breadcrumb */}
        <Breadcrumb productName={currentProduct.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <ProductImageGallery
            product={currentProduct}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          {/* Product Info */}
          <div className="space-y-8">
            <ProductHeader product={currentProduct} />
            <PriceDisplay product={currentProduct} />
            <ColorSelector
              product={currentProduct}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <QuantitySelector
                product={currentProduct}
                quantity={quantity}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />

              <ActionButtons
                product={currentProduct}
                onShare={handleShare}
              />

              {/* Stock Warning */}
              {quantity === currentProduct.stock && currentProduct.stock > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-800 text-sm font-medium">
                    Maximum quantity reached! Only {currentProduct.stock} items available.
                  </p>
                </div>
              )}
            </div>

            <ServiceFeatures />
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-16">
          <ProductDescription product={currentProduct} />
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;