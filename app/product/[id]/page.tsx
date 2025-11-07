'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Copy, ShoppingCart, Zap, Share2 } from 'lucide-react';
import { Product } from '@/types/product';
import Breadcrumb from '@/components/ProductDetails/Breadcrumb';
import ProductImageGallery from '@/components/ProductDetails/ProductImageGallery';
import ProductHeader from '@/components/ProductDetails/ProductHeader';
import PriceDisplay from '@/components/ProductDetails/PriceDisplay';
import QuantitySelector from '@/components/ProductDetails/QuantitySelector';
import ServiceFeatures from '@/components/ProductDetails/ServiceFeatures';
import ProductDescription from '@/components/ProductDetails/ProductDescription';

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedColorName: string;
  addedAt: string;
}

const ProductDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [selectedColor, setSelectedColor] = useState<string>('#1488CC');
  const [selectedColorName, setSelectedColorName] = useState<string>('Blue');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState<boolean>(false);
console.log(showShareOptions)
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`https://all-mart-avenue-backend.vercel.app/products/${productId}`);
        const productData = response.data;
        setCurrentProduct(productData);

        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0].value);
          setSelectedColorName(productData.colors[0].name);
        }

        setError(null);
      } catch {
        console.error('Error fetching product');
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

    // Check if Web Share API is supported (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentProduct.name,
          text: `Check out ${currentProduct.name} on AllMart Avenue!`,
          url: productUrl,
        });
        setShowShareOptions(false);
        return;
      } catch (error) {
        console.log('Web Share API failed, falling back to clipboard');
      }
    }

    // Fallback to clipboard for desktop
    try {
      await navigator.clipboard.writeText(productUrl);
      showNotificationMessage('Product link copied to clipboard!');
      setShowShareOptions(false);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = productUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showNotificationMessage('Product link copied to clipboard!');
      setShowShareOptions(false);
    }
  };

  // const handleSocialShare = (platform: string): void => {
  //   if (!currentProduct) return;

  //   const productUrl = `${window.location.origin}/product/${currentProduct._id}`;
  //   const shareText = `Check out ${currentProduct.name} on AllMart Avenue! ${productUrl}`;
  //   const encodedUrl = encodeURIComponent(productUrl);
  //   const encodedText = encodeURIComponent(`Check out ${currentProduct.name} on AllMart Avenue!`);

  //   let shareUrl = '';

  //   switch (platform) {
  //     case 'facebook':
  //       // Facebook Share Dialog
  //       shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
  //       window.open(shareUrl, 'facebook-share-dialog', 'width=800,height=600');
  //       break;

  //     case 'whatsapp':
  //       // WhatsApp - works on both mobile and desktop
  //       if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  //         // Mobile - will open WhatsApp app directly
  //         shareUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
  //         window.location.href = shareUrl;
  //       } else {
  //         // Desktop - open web.whatsapp.com
  //         shareUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  //         window.open(shareUrl, '_blank', 'width=800,height=600');
  //       }
  //       break;

  //     case 'messenger':
  //       // Facebook Messenger
  //       if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  //         // Mobile - try to open Messenger app
  //         shareUrl = `fb-messenger://share?link=${encodedUrl}`;
  //         window.location.href = shareUrl;
  //       } else {
  //         // Desktop - open messenger.com
  //         shareUrl = `https://www.messenger.com/new`;
  //         window.open(shareUrl, '_blank', 'width=800,height=600');
  //         // Note: Messenger desktop doesn't support pre-filled messages for security reasons
  //       }
  //       break;

  //     case 'twitter':
  //       // Twitter
  //       shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  //       window.open(shareUrl, 'twitter-share', 'width=800,height=400');
  //       break;

  //     case 'telegram':
  //       // Telegram
  //       shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
  //       window.open(shareUrl, 'telegram-share', 'width=800,height=600');
  //       break;

  //     default:
  //       return;
  //   }

  //   setShowShareOptions(false);
  // };

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const getCartFromStorage = (): CartItem[] => {
    if (typeof window === 'undefined') return [];

    try {
      const cartData = localStorage.getItem('allmart-cart');
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  };

  const saveCartToStorage = (cart: CartItem[]): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('allmart-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  const handleAddToCart = (): void => {
    if (!currentProduct) return;

    const cartItem: CartItem = {
      product: currentProduct,
      quantity: quantity,
      selectedColor: selectedColor,
      selectedColorName: selectedColorName,
      addedAt: new Date().toISOString()
    };

    const currentCart = getCartFromStorage();

    const existingItemIndex = currentCart.findIndex(
      item => item.product._id === currentProduct._id && item.selectedColor === selectedColor
    );

    let updatedCart: CartItem[];

    if (existingItemIndex > -1) {
      updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      updatedCart = [...currentCart, cartItem];
    }

    saveCartToStorage(updatedCart);
    showNotificationMessage(`Added ${quantity} item(s) to cart!`);
  };

  const handleBuyNow = (): void => {
    if (!currentProduct) return;

    handleAddToCart();

    setTimeout(() => {
      router.push('/cart');
    }, 500);
  };

  const handleColorSelect = (colorValue: string, colorName: string): void => {
    setSelectedColor(colorValue);
    setSelectedColorName(colorName);
  };

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
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-fade-in">
          <Copy className="w-4 h-4" />
          <span>{notificationMessage}</span>
        </div>
      )}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb productName={currentProduct.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImageGallery
            product={currentProduct}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          <div className="space-y-8">
            <ProductHeader product={currentProduct} />
            <PriceDisplay product={currentProduct} />

            {/* Color Selector */}
            {currentProduct.colors && currentProduct.colors.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Color</h3>
                  <span className="text-sm text-gray-600">
                    Selected: {selectedColorName}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {currentProduct.colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleColorSelect(color.value, color.name)}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${selectedColor === color.value
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {selectedColor === color.value && (
                        <div className="w-2 h-2 bg-white rounded-full opacity-80" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <QuantitySelector
                product={currentProduct}
                quantity={quantity}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={currentProduct.stock === 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={currentProduct.stock === 0}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  <Zap className="w-5 h-5" />
                  Buy Now
                </button>
              </div>

              <button
                onClick={() => handleShare()}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-3"
              >
                <Share2 className="w-4 h-4" />
                Share Product
              </button>

              {quantity === currentProduct.stock && currentProduct.stock > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-800 text-sm font-medium">
                    Maximum quantity reached! Only {currentProduct.stock} items available.
                  </p>
                </div>
              )}

              {currentProduct.stock === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-800 text-sm font-medium">
                    This product is currently out of stock.
                  </p>
                </div>
              )}
            </div>

            <ServiceFeatures />
          </div>
        </div>

        <div className="mt-16">
          <ProductDescription product={currentProduct} />
        </div>
      </div>

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