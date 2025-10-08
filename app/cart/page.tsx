"use client";

import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, MapPin, Phone, Home } from 'lucide-react';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: string;
    originalPrice?: string;
    discount?: number;
    images: string[];
    stock: number;
    category: string;
    colors: Array<{ value: string; name: string }>;
  };
  quantity: number;
  selectedColor: string;
  selectedColorName: string;
  addedAt: string;
}

interface DeliveryAddress {
  name: string;
  phone: string;
  zela: string;
  upozela: string;
  houseNumber: string;
  street: string;
}

interface OrderData {
  customerInfo: DeliveryAddress;
  items: CartItem[];
  deliveryLocation: string;
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  orderDate: string;
  paymentMethod: string;
  status: string;
  orderNumber: string;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryLocation, setDeliveryLocation] = useState<'dhaka' | 'outside'>('dhaka');
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    name: '',
    phone: '',
    zela: '',
    upozela: '',
    houseNumber: '',
    street: ''
  });
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCartItems = () => {
      try {
        const savedCart = localStorage.getItem('allmart-cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart || []);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        toast.error('Failed to load cart items');
        setCartItems([]);
      }
    };

    loadCartItems();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('allmart-cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const subtotal = cartItems.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0);
  const deliveryCharge = deliveryLocation === 'dhaka' ? 100 : 150;
  const grandTotal = subtotal + deliveryCharge;

  const updateQuantity = (productId: string, color: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cartItems.find(item => item.product._id === productId && item.selectedColor === color);
    if (item && newQuantity > item.product.stock) {
      toast.error(`Only ${item.product.stock} items available in stock`);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.product._id === productId && item.selectedColor === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, color: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This item will be removed from your cart!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setCartItems(prev =>
          prev.filter(item => !(item.product._id === productId && item.selectedColor === color))
        );
        toast.success('Item removed from cart');
      }
    });
  };

  const changeColor = (productId: string, oldColor: string, newColor: string, newColorName: string) => {
    const existingItemWithNewColor = cartItems.find(
      item => item.product._id === productId && item.selectedColor === newColor
    );

    if (existingItemWithNewColor) {
      toast.error('This color variant is already in your cart');
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.product._id === productId && item.selectedColor === oldColor
          ? { ...item, selectedColor: newColor, selectedColorName: newColorName }
          : item
      )
    );
    toast.success('Color changed successfully');
  };

  const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const generateOrderNumber = () => {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const submitOrder = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const orderData: OrderData = {
      customerInfo: deliveryAddress,
      items: cartItems,
      deliveryLocation: deliveryLocation,
      subtotal: subtotal,
      deliveryCharge: deliveryCharge,
      grandTotal: grandTotal,
      orderDate: new Date().toISOString(),
      paymentMethod: 'Cash on Delivery',
      status: 'pending',
      orderNumber: generateOrderNumber()
    };

    try {
      const response = await axios.post('https://all-mart-avenue-backend.vercel.app/orders', orderData);

      if (response.status === 201) {
        setOrderData(orderData);

        Swal.fire({
          title: '🎉 Order Placed Successfully!',
          html: `
            <div class="text-center">
              <div class="text-6xl mb-4">🥳</div>
              <h3 class="text-xl font-bold text-green-600 mb-2">Thank You for Your Order!</h3>
              <p class="text-gray-600 mb-4">Your order has been confirmed and will be delivered soon.</p>
              <div class="bg-gray-100 p-4 rounded-lg text-left">
                <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
                <p><strong>Total Amount:</strong> ৳${grandTotal.toFixed(2)}</p>
                <p><strong>Payment Method:</strong> Cash on Delivery</p>
                <p><strong>Delivery to:</strong> ${deliveryAddress.zela}, ${deliveryAddress.upozela}</p>
              </div>
            </div>
          `,
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Invoice',
          cancelButtonText: 'Continue Shopping',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            downloadInvoice();
          }
          setCartItems([]);
          localStorage.removeItem('allmart-cart');
        });
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadInvoice = () => {
    const invoiceElement = document.getElementById('invoice');

    if (invoiceElement) {
      html2canvas(invoiceElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 10;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`invoice-${orderData?.orderNumber}.pdf`);
      });
    }
  };



  if (cartItems.length === 0 && !orderData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to your cart to see them here.</p>
            <button
              onClick={() => window.location.href = '/products'}
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

  if (orderData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600 mb-6">Thank you for shopping with us. Your order is being processed.</p>

              <div className="flex gap-4 justify-center mb-8">


                <button
                  onClick={() => window.location.href = '/products'}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Invoice */}
            <div id="invoice" className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">AllMart Avenue</h2>
                <p className="text-gray-600">Invoice</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
                  <p><strong>Order Number:</strong> {orderData.orderNumber}</p>
                  <p><strong>Order Date:</strong> {new Date(orderData.orderDate).toLocaleDateString()}</p>
                  <p><strong>Payment Method:</strong> {orderData.paymentMethod}</p>
                  <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Confirmed</span></p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Delivery Information</h3>
                  <p><strong>Name:</strong> {orderData.customerInfo.name}</p>
                  <p><strong>Phone:</strong> {orderData.customerInfo.phone}</p>
                  <p><strong>Address:</strong> {orderData.customerInfo.houseNumber}, {orderData.customerInfo.street}</p>
                  <p><strong>Area:</strong> {orderData.customerInfo.upozela}, {orderData.customerInfo.zela}</p>
                  <p><strong>Delivery:</strong> {orderData.deliveryLocation === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
                <div className="border rounded-lg">
                  <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-semibold">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2">Color</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-3 text-right">Price</div>
                  </div>
                  {orderData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-4 border-t">
                      <div className="col-span-5">
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-600">{item.product.category}</p>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                          <span className="text-sm">{item.selectedColorName}</span>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">{item.quantity}</div>
                      <div className="col-span-3 text-right">
                        ৳{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>৳{orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Delivery Charge:</span>
                  <span>৳{orderData.deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">৳{orderData.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 text-center text-gray-500 text-sm">
                <p>Thank you for your order! We'll contact you soon for delivery.</p>
                <p>For any queries, contact: 017XXXXXXXX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Cart Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.product._id}-${item.selectedColor}`} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                    </div>

                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">{item.product.category}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.selectedColor }}
                            title={item.selectedColorName}
                          />
                          <span className="text-sm text-gray-500">{item.selectedColorName}</span>
                        </div>

                        {item.product.colors && item.product.colors.length > 1 && (
                          <div className="flex gap-1 ml-4">
                            {item.product.colors.map((color) => (
                              <button
                                key={color.value}
                                onClick={() => changeColor(item.product._id, item.selectedColor, color.value, color.name)}
                                className={`w-4 h-4 rounded-full border-2 transition-all ${item.selectedColor === color.value
                                  ? 'border-blue-500 ring-2 ring-blue-200'
                                  : 'border-gray-300 hover:border-gray-400'
                                  }`}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mt-1">Stock: {item.product.stock}</p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-blue-600">৳{item.product.price}</span>
                        {item.product.originalPrice && item.product.originalPrice !== item.product.price && (
                          <span className="text-sm text-gray-500 line-through">৳{item.product.originalPrice}</span>
                        )}
                        {item.product.discount && item.product.discount > 0 && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            {item.product.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.selectedColor, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-8 text-center font-semibold">{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item.product._id, item.selectedColor, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ৳{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product._id, item.selectedColor)}
                        className="text-red-500 hover:text-red-700 transition-colors mt-2 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                onClick={submitOrder}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Proceed to Checkout'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By completing your purchase, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>

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