'use client'
import React from 'react';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types/product';

interface ProductImageGalleryProps {
  product: Product;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  product,
  selectedImage,
  setSelectedImage
}) => {
  const hasVideo = !!product.videoURL;

  return (
    <div className="space-y-6">
      {/* Main Image/Video */}
      <div className="aspect-square rounded-2xl bg-gray-50 overflow-hidden border border-gray-200">
        {hasVideo && selectedImage === 0 ? (
          <div className="w-full h-full relative">
            <iframe
              src={product.videoURL}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Product Video"
            />
          </div>
        ) : (
          <Image
            src={product.images[hasVideo ? selectedImage - 1 : selectedImage]}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-4">
        {/* Video Thumbnail - Only show if video exists */}
        {hasVideo && (
          <button
            onClick={() => setSelectedImage(0)}
            className={`aspect-square rounded-xl overflow-hidden relative transition-all duration-200 ${selectedImage === 0
              ? 'p-1 bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg'
              : 'border-2 border-gray-200 hover:border-gray-300'
              }`}
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center rounded-lg">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
              Video
            </div>
          </button>
        )}

        {/* Image Thumbnails */}
        {product.images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(hasVideo ? index + 1 : index)}
            className={`aspect-square rounded-xl overflow-hidden relative transition-all duration-200 ${(hasVideo ? selectedImage === index + 1 : selectedImage === index)
              ? 'p-1 bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg'
              : 'border-2 border-gray-200 hover:border-gray-300'
              }`}
          >
            <Image
              src={image}
              alt={`${product.name} view ${index + 1}`}
              width={150}
              height={150}
              className="w-full h-full object-cover rounded-lg"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;