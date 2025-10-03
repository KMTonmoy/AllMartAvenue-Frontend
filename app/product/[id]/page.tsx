'use client'
import React, { useState } from 'react';
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


interface ProductDetailsProps {
  product?: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors?.[0]?.value || '#1488CC');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // Default product data
  const defaultProduct: Product = {
    id: 2,
    name: "Ladies Cotton Three Piece",
    description: "This beautiful cotton three-piece set is perfect for summer occasions. Made from 100% premium cotton fabric, it offers exceptional comfort and breathability. The unstitched design allows for custom tailoring to ensure the perfect fit for any body type.",
    details: "Cotton fabric, summer collection, unstitched",
    price: "2450",
    originalPrice: "2800",
    discount: 12,
    category: "fashion",
    productTag: "featured",
    stock: 15,
    colors: [
      { value: '#1488CC', name: 'Sky Blue' },
      { value: '#2B32B2', name: 'Royal Blue' },
      { value: '#000000', name: 'Black' },
      { value: '#FFFFFF', name: 'White' }
    ],
    images: [
      'https://images.othoba.com/images/thumbs/0692857_womens-readymade-cotton-three-piece.webp',
      'https://images.othoba.com/images/thumbs/0692854_pinted-silk-saree-with-blouse-piece-free.webp',
      'https://images.othoba.com/images/thumbs/0692857_womens-readymade-cotton-three-piece.webp'
    ],
    videoURL: "https://www.youtube.com/embed/YzcWhOROTDg?si=9jIHl0Cf1JEF_Wrx",
    features: [
      "100% Premium Cotton Fabric",
      "Summer Collection 2024",
      "Unstitched for Custom Tailoring",
      "Machine Washable",
      "Available in Multiple Colors"
    ]
  };

  const currentProduct = product || defaultProduct;

  const handleIncrement = (): void => {
    if (quantity < currentProduct.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = (): void => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleShare = async (): Promise<void> => {
    const productUrl = `${window.location.origin}/product/${currentProduct.id}`;
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