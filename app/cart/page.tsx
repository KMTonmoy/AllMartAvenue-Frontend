"use client";

import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, MapPin, Phone, Home } from 'lucide-react';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  stock: number;
  category: string;
}

interface DeliveryAddress {
  name: string;
  phone: string;
  zela: string;
  upozela: string;
  houseNumber: string;
  street: string;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Premium Leather Backpack',
      price: 189,
      originalPrice: 249,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop',
      quantity: 1,
      stock: 15,
      category: 'Bags'
    },
    {
      id: '2',
      name: 'Designer Crossbody Handbag',
      price: 129,
      originalPrice: 179,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&h=150&fit=crop',
      quantity: 2,
      stock: 20,
      category: 'Bags'
    },
    {
      id: '3',
      name: 'Floral Summer Maxi Dress',
      price: 59,
      originalPrice: 89,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=150&h=150&fit=crop',
      quantity: 1,
      stock: 25,
      category: 'Clothing'
    }
  ]);

  const [deliveryLocation, setDeliveryLocation] = useState<'dhaka' | 'outside'>('dhaka');
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    name: '',
    phone: '',
    zela: '',
    upozela: '',
    houseNumber: '',
    street: ''
  });

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryCharge = deliveryLocation === 'dhaka' ? 100 : 150;
  const grandTotal = subtotal + deliveryCharge;

  // Update quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cartItems.find(item => item.id === id);
    if (item && newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    toast.success('Quantity updated');
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setCartItems(prev => prev.filter(item => item.id !== id));
        toast.success('Item removed from cart');
      }
    });
  };

  // Handle address change
  const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!deliveryAddress.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!deliveryAddress.phone.trim() || deliveryAddress.phone.length < 11) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    if (!deliveryAddress.zela.trim()) {
      toast.error('Please enter your district');
      return false;
    }
    if (!deliveryAddress.upozela.trim()) {
      toast.error('Please enter your upazila');
      return false;
    }
    if (!deliveryAddress.houseNumber.trim()) {
      toast.error('Please enter your house number');
      return false;
    }
    return true;
  };

  // Checkout
  const handleCheckout = () => {
    if (!validateForm()) return;

    Swal.fire({
      title: 'Confirm Order?',
      html: `
        <div class="text-left">
          <p><strong>Total Items:</strong> ${cartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
          <p><strong>Subtotal:</strong> ৳${subtotal}</p>
          <p><strong>Delivery:</strong> ৳${deliveryCharge}</p>
          <p><strong>Grand Total:</strong> ৳${grandTotal}</p>
          <p><strong>Delivery to:</strong> ${deliveryAddress.zela}, ${deliveryAddress.upozela}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, place order!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Order Placed!',
          'Your order has been successfully placed.',
          'success'
        );

        console.log('Order details:', {
          items: cartItems,
          address: deliveryAddress,
          deliveryLocation,
          subtotal,
          deliveryCharge,
          grandTotal
        });
      }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to your cart to see them here.</p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Cart Items & Address */}
          <div className="lg:w-2/3 space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart ({cartItems.length} items)</h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      <p className="text-sm text-gray-500">Stock: {item.stock}</p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-blue-600">৳{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">৳{item.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-8 text-center font-semibold">{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Total Price & Remove */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">৳{(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors mt-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Location */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Location
              </h3>

              <div className="flex gap-4 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryLocation"
                    value="dhaka"
                    checked={deliveryLocation === 'dhaka'}
                    onChange={(e) => setDeliveryLocation(e.target.value as 'dhaka')}
                    className="text-blue-600"
                  />
                  <span>Inside Dhaka (৳100)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryLocation"
                    value="outside"
                    checked={deliveryLocation === 'outside'}
                    onChange={(e) => setDeliveryLocation(e.target.value as 'outside')}
                    className="text-blue-600"
                  />
                  <span>Outside Dhaka (৳150)</span>
                </label>
              </div>

              {/* Delivery Address Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.name}
                    onChange={(e) => handleAddressChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={deliveryAddress.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District (Zela) *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.zela}
                    onChange={(e) => handleAddressChange('zela', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your district"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upazila *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.upozela}
                    onChange={(e) => handleAddressChange('upozela', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your upazila"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    House Number *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.houseNumber}
                    onChange={(e) => handleAddressChange('houseNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="House/Road no."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Street name, area"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-semibold">৳{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="font-semibold">৳{deliveryCharge}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Grand Total</span>
                    <span className="text-blue-600">৳{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By completing your purchase, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 4000,
          },
        }}
      />
    </div>
  );
};

export default CartPage;