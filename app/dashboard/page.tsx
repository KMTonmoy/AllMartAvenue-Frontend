'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  RefreshCw,
  CheckCircle,
  XCircle,
  RotateCcw,
  Truck,
  Clock,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  description: string;
  details: string;
  price: string;
  originalPrice: string;
  discount: number;
  category: string;
  productTag: string;
  stock: number;
  colors: Array<{ value: string; name: string }>;
  images: string[];
  videoURL: string;
  features: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface Order {
  _id: string;
  customerInfo: {
    name: string;
    phone: string;
    zela: string;
    upozela: string;
    houseNumber: string;
    street: string;
  };
  items: Array<{
    product: Product;
    quantity: number;
    selectedColor: string;
    selectedColorName: string;
    addedAt: string;
  }>;
  deliveryLocation: string;
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  orderDate: string;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  returnedAt?: string;
}

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse, ordersResponse] = await Promise.all([
        fetch('https://all-mart-avenue-backend.vercel.app/products'),
        fetch('https://all-mart-avenue-backend.vercel.app/orders')
      ]);

      if (!productsResponse.ok || !ordersResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const productsData = await productsResponse.json();
      const ordersData = await ordersResponse.json();

      setProducts(productsData);
      setOrders(ordersData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deliveredOrders = orders.filter(order => order.status === 'delivered');
  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.grandTotal, 0);
  const totalCancelledRevenue = orders
    .filter(order => order.status === 'cancelled')
    .reduce((sum, order) => sum + order.grandTotal, 0);
  const totalReturnedRevenue = orders
    .filter(order => order.status === 'returned')
    .reduce((sum, order) => sum + order.grandTotal, 0);

  const stats = {
    totalRevenue: totalRevenue,
    totalCancelledRevenue: totalCancelledRevenue,
    totalReturnedRevenue: totalReturnedRevenue,
    totalOrders: orders.length,
    totalProducts: products.length,
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    deliveredOrders: deliveredOrders.length,
    cancelledOrders: orders.filter(order => order.status === 'cancelled').length,
    returnedOrders: orders.filter(order => order.status === 'returned').length,
    confirmedOrders: orders.filter(order => order.status === 'confirmed').length,
    shippedOrders: orders.filter(order => order.status === 'shipped').length,
    outOfStockProducts: products.filter(product => product.stock === 0).length,
    lowStockProducts: products.filter(product => product.stock > 0 && product.stock <= 10).length,
    averageOrderValue: orders.length > 0 ?
      orders.reduce((sum, order) => sum + order.grandTotal, 0) / orders.length : 0
  };

  // Get last 10 recent orders
  const recentOrders = orders
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 10);

  // Get last 10 recent products
  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
    .slice(0, 10);

  // Pagination for recent products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = recentProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(recentProducts.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'returned': return <RotateCcw className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return 'destructive';
    if (stock <= 10) return 'outline';
    return 'default';
  };

  const getStockBadgeText = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 10) return `Low Stock`;
    return `In Stock`;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Comprehensive view of your business performance and analytics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {stats.deliveredOrders} delivered orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled Revenue</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.totalCancelledRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {stats.cancelledOrders} cancelled orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returned Revenue</CardTitle>
            <RotateCcw className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.totalReturnedRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {stats.returnedOrders} returned orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.pendingOrders} pending
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span className="text-red-600">{stats.outOfStockProducts} out of stock</span>
              <span>•</span>
              <span className="text-orange-600">{stats.lowStockProducts} low stock</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across all orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Efficiency</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalOrders > 0 ? ((stats.deliveredOrders / stats.totalOrders) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Success rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: 'pending', count: stats.pendingOrders, color: 'bg-yellow-500', revenue: 0 },
                { status: 'confirmed', count: stats.confirmedOrders, color: 'bg-blue-500', revenue: 0 },
                { status: 'shipped', count: stats.shippedOrders, color: 'bg-purple-500', revenue: 0 },
                { status: 'delivered', count: stats.deliveredOrders, color: 'bg-green-500', revenue: stats.totalRevenue },
                { status: 'cancelled', count: stats.cancelledOrders, color: 'bg-red-500', revenue: stats.totalCancelledRevenue },
                { status: 'returned', count: stats.returnedOrders, color: 'bg-orange-500', revenue: stats.totalReturnedRevenue },
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <div>
                      <span className="text-sm font-medium capitalize">{item.status}</span>
                      {item.revenue > 0 && (
                        <p className="text-xs text-muted-foreground">৳{item.revenue.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{item.count}</span>
                    <span className="text-xs text-muted-foreground">
                      ({stats.totalOrders > 0 ? ((item.count / stats.totalOrders) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Products ({recentProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        <Badge variant={getStockBadgeVariant(product.stock)} className="text-xs">
                          {getStockBadgeText(product.stock)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    ৳{product.price}
                  </Badge>
                </div>
              ))}

              {/* Pagination Controls */}
              {recentProducts.length > itemsPerPage && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, recentProducts.length)} of {recentProducts.length} products
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Orders ({recentOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">{order.customerInfo.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">৳{order.grandTotal}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No orders found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Product Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products
                .filter(product => product.stock <= 10)
                .slice(0, 5)
                .map((product) => (
                  <div key={product._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStockBadgeVariant(product.stock)} className="text-xs">
                        {getStockBadgeText(product.stock)}
                      </Badge>
                      <p className="text-sm font-semibold mt-1">৳{product.price}</p>
                    </div>
                  </div>
                ))}
              {products.filter(product => product.stock <= 10).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  All products have sufficient stock
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">
              ৳{stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-sm text-green-600 mt-2">
              From {stats.deliveredOrders} delivered orders
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Lost Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-800">
              ৳{(stats.totalCancelledRevenue + stats.totalReturnedRevenue).toFixed(2)}
            </div>
            <p className="text-sm text-red-600 mt-2">
              {stats.cancelledOrders} cancelled + {stats.returnedOrders} returned orders
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">
              {stats.totalOrders > 0 ?
                ((stats.deliveredOrders / stats.totalOrders) * 100).toFixed(1) : 0
              }%
            </div>
            <p className="text-sm text-blue-600 mt-2">
              {stats.deliveredOrders} out of {stats.totalOrders} orders successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;