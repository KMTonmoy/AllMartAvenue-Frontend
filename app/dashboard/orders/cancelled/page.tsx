'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Search,
  Trash2,
  Package,
  RefreshCw,
  ArrowUpDown,
  Info,
  ShoppingCart,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  Download,
  Printer,
  MessageCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import Image from 'next/image';

interface CustomerInfo {
  name: string;
  phone: string;
  zela: string;
  upozela: string;
  houseNumber: string;
  street: string;
}

interface OrderItem {
  product: {
    _id: string;
    name: string;
    description: string;
    price: string;
    images: string[];
    colors: Array<{ value: string; name: string }>;
  };
  quantity: number;
  selectedColor: string;
  selectedColorName: string;
  addedAt: string;
}

interface Order {
  _id: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
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
  returnReason?: string;
}

// Extended type for sorting that includes nested properties
type SortableField = keyof Order | 'customerName' | 'customerPhone';

interface StatusUpdateData {
  status: Order['status'];
  trackingNumber?: string;
}

const CancelledOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('cancelled');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [sortField, setSortField] = useState<SortableField>('orderDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [bulkAction, setBulkAction] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const loadingToast = toast.loading('Loading orders...');
    try {
      setLoading(true);
      const response = await fetch('https://all-mart-avenue-backend.vercel.app/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
      toast.success('Orders loaded successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status'], trackingNum?: string) => {
    const updateToast = toast.loading(`Updating order to ${newStatus}...`);

    try {
      const updateData: StatusUpdateData = { status: newStatus };
      if (newStatus === 'shipped' && trackingNum) {
        updateData.trackingNumber = trackingNum;
      }

      await fetch(`https://all-mart-avenue-backend.vercel.app/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      // Update local state and remove from list if status is no longer pending
      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, status: newStatus, trackingNumber: trackingNum } : order
      ));

      toast.success(`Order status updated to ${newStatus} successfully!`, { id: updateToast });

      // Reset tracking number
      setTrackingNumber('');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status', { id: updateToast });
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) {
      toast.error('Please select orders and an action');
      return;
    }

    if (bulkAction === 'delete') {
      const result = await Swal.fire({
        title: 'Delete Multiple Orders?',
        text: `You are about to delete ${selectedOrders.length} order(s). This action cannot be undone!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete them!',
        cancelButtonText: 'Cancel',
      });

      if (!result.isConfirmed) return;
    }

    const bulkToast = toast.loading(`Processing ${selectedOrders.length} order(s)...`);

    try {
      const promises = selectedOrders.map(orderId => {
        if (bulkAction === 'delete') {
          return fetch(`https://all-mart-avenue-backend.vercel.app/orders/${orderId}`, { method: 'DELETE' });
        } else {
          const status = bulkAction.replace('mark_', '') as Order['status'];
          return fetch(`https://all-mart-avenue-backend.vercel.app/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          });
        }
      });

      const results = await Promise.all(promises);
      const allSuccess = results.every(response => response.ok);

      if (allSuccess) {
        if (bulkAction === 'delete') {
          setOrders(prev => prev.filter(order => !selectedOrders.includes(order._id)));
          toast.success(`${selectedOrders.length} order(s) deleted successfully!`, { id: bulkToast });
        } else {
          const status = bulkAction.replace('mark_', '') as Order['status'];
          setOrders(prev => prev.map(order =>
            selectedOrders.includes(order._id) ? { ...order, status } : order
          ));
          toast.success(`${selectedOrders.length} order(s) updated to ${status}!`, { id: bulkToast });
        }
        setSelectedOrders([]);
        setBulkAction('');
      } else {
        throw new Error('Some operations failed');
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to complete bulk action', { id: bulkToast });
    }
  };

  const handleDelete = async (order: Order) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete order &quot;${order.orderNumber}&quot;. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      toast('Order deletion cancelled', { icon: 'ℹ️' });
      return;
    }

    const deleteToast = toast.loading('Deleting order...');
    try {
      const response = await fetch(`https://all-mart-avenue-backend.vercel.app/orders/${order._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete order');

      setOrders(prev => prev.filter(o => o._id !== order._id));

      await Swal.fire({
        title: 'Deleted!',
        text: 'Order has been deleted successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      toast.success('Order deleted successfully!', { id: deleteToast });
    } catch (error) {
      console.error('Error deleting order:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to delete order. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3b82f6',
      });
      toast.error('Failed to delete order', { id: deleteToast });
    } finally {
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleSort = (field: SortableField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = () => {
    toast.promise(fetchOrders(), {
      loading: 'Refreshing orders...',
      success: 'Orders refreshed successfully!',
      error: 'Failed to refresh orders',
    });
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
    const variants: Record<Order['status'], "default" | "secondary" | "destructive" | "outline"> = {
      pending: 'outline',
      confirmed: 'secondary',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive',
      returned: 'outline',
    };
    return variants[status];
  };

  const getStatusIcon = (status: Order['status']) => {
    const icons = {
      pending: <Clock className="h-3 w-3" />,
      confirmed: <CheckCircle className="h-3 w-3" />,
      shipped: <Truck className="h-3 w-3" />,
      delivered: <CheckCircle className="h-3 w-3" />,
      cancelled: <XCircle className="h-3 w-3" />,
      returned: <RotateCcw className="h-3 w-3" />,
    };
    return icons[status];
  };

  const getPaymentBadgeVariant = (method: string) => {
    return method === 'Cash on Delivery' ? 'outline' as const : 'secondary' as const;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredAndSortedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredAndSortedOrders.map(order => order._id));
    }
  };

  const exportOrders = () => {
    const dataToExport = filteredAndSortedOrders.map(order => ({
      'Order Number': order.orderNumber,
      'Customer Name': order.customerInfo.name,
      'Customer Phone': order.customerInfo.phone,
      'Total Amount': `৳${order.grandTotal}`,
      'Payment Method': order.paymentMethod,
      'Status': order.status,
      'Order Date': formatDateTime(order.orderDate),
      'Items': order.items.map(item => `${item.product.name} (Qty: ${item.quantity})`).join('; '),
    }));

    const csv = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Orders exported successfully!');
  };

  const sendSMSNotification = (order: Order) => {
    // This would integrate with an SMS service in a real application
    toast.success(`SMS notification sent to ${order.customerInfo.phone}`);
  };

  const printOrder = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Order ${order.orderNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .section-title { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
              .total { font-weight: bold; font-size: 1.2em; }
              .taka { font-family: Arial; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Order Invoice: ${order.orderNumber}</h1>
              <p>Date: ${formatDateTime(order.orderDate)}</p>
            </div>

            <div class="section">
              <div class="section-title">Customer Information</div>
              <p><strong>Name:</strong> ${order.customerInfo.name}</p>
              <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
              <p><strong>Address:</strong> ${order.customerInfo.houseNumber}, ${order.customerInfo.street}, ${order.customerInfo.upozela}, ${order.customerInfo.zela}</p>
            </div>

            <div class="section">
              <div class="section-title">Order Items</div>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map(item => `
                    <tr>
                      <td>${item.product.name}</td>
                      <td>${item.quantity}</td>
                      <td class="taka">৳${item.product.price}</td>
                      <td class="taka">৳${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="section">
              <div class="section-title">Order Summary</div>
              <p><strong>Subtotal:</strong> <span class="taka">৳${order.subtotal}</span></p>
              <p><strong>Delivery Charge:</strong> <span class="taka">৳${order.deliveryCharge}</span></p>
              <p class="total"><strong>Grand Total:</strong> <span class="taka">৳${order.grandTotal}</span></p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getSortValue = (order: Order, field: SortableField) => {
    switch (field) {
      case 'customerName':
        return order.customerInfo.name.toLowerCase();
      case 'customerPhone':
        return order.customerInfo.phone;
      case 'orderDate':
      case 'createdAt':
      case 'updatedAt':
        return new Date(order[field]).getTime();
      case 'grandTotal':
      case 'subtotal':
        return order[field];
      case 'orderNumber':
      case 'paymentMethod':
      case 'status':
      case 'deliveryLocation':
        return order[field].toLowerCase();
      default:
        return order[field] as string | number;
    }
  };

  // Filter to show only cancelled orders by default
  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch =
        order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.phone.includes(searchTerm) ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = getSortValue(a, sortField);
      const bValue = getSortValue(b, sortField);

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return 0;
    });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    returned: orders.filter(o => o.status === 'returned').length,
    revenue: orders.filter(o => o.status === 'delivered').reduce((sum, order) => sum + order.grandTotal, 0),
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cancelled Orders Management</h1>
          <p className="text-muted-foreground">Manage cancelled customer orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportOrders}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Truck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.cancelled}</div>
            <p className="text-xs text-red-600 mt-1">Cancelled orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-2 py-1">
                  {selectedOrders.length} selected
                </Badge>
                <span className="text-sm text-blue-700">
                  {selectedOrders.length} order(s) selected for bulk action
                </span>
              </div>
              <div className="flex gap-2 ml-auto">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-white text-sm"
                >
                  <option value="">Choose action...</option>
                  <option value="mark_confirmed">Mark as Confirmed</option>
                  <option value="mark_shipped">Mark as Shipped</option>
                  <option value="mark_delivered">Mark as Delivered</option>
                  <option value="mark_pending">Mark as Pending</option>
                  <option value="delete">Delete Orders</option>
                </select>
                <Button onClick={handleBulkAction} size="sm">
                  Apply
                </Button>
                <Button variant="outline" onClick={() => setSelectedOrders([])} size="sm">
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cancelled orders by customer name, phone, or order number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="cancelled">Cancelled Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedStatus === 'cancelled' ? 'Cancelled Orders' :
              selectedStatus === 'pending' ? 'Pending Orders' :
                selectedStatus === 'confirmed' ? 'Confirmed Orders' :
                  selectedStatus === 'shipped' ? 'Shipped Orders' :
                    selectedStatus === 'delivered' ? 'Delivered Orders' : 'Returned Orders'}
            ({filteredAndSortedOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredAndSortedOrders.length && filteredAndSortedOrders.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead className="w-[180px]">
                    <Button variant="ghost" onClick={() => handleSort('orderNumber')} className="p-0 hover:bg-transparent font-semibold">
                      Order Number
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('customerName')} className="p-0 hover:bg-transparent font-semibold">
                      Customer
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('grandTotal')} className="p-0 hover:bg-transparent font-semibold">
                      Total
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('orderDate')} className="p-0 hover:bg-transparent font-semibold">
                      Order Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right font-semibold w-[250px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedOrders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-muted/50">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => handleSelectOrder(order._id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-semibold">{order.orderNumber}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(order.orderDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.customerInfo.name}</span>
                        <span className="text-sm text-muted-foreground">{order.customerInfo.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{order.items.length} item(s)</span>
                        <span className="text-xs text-muted-foreground">
                          {order.items[0]?.product.name}
                          {order.items.length > 1 && ` +${order.items.length - 1} more`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">৳${order.grandTotal}</span>
                        <span className="text-xs text-muted-foreground">
                          Items: ৳${order.subtotal} + Delivery: ৳${order.deliveryCharge}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPaymentBadgeVariant(order.paymentMethod)}>
                        {order.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatDate(order.orderDate)}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.orderDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedOrder(order); setViewDialogOpen(true); }} className="h-8 px-2" title="View Details">
                          <Info className="h-3 w-3" />
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => printOrder(order)} className="h-8 px-2" title="Print Order">
                          <Printer className="h-3 w-3" />
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => sendSMSNotification(order)} className="h-8 px-2" title="Send SMS">
                          <MessageCircle className="h-3 w-3" />
                        </Button>

                        {/* Status Dropdown */}
                        <select
                          value={order.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as Order['status'];
                            if (newStatus === 'shipped') {
                              setEditingOrder(order);
                              setEditDialogOpen(true);
                            } else {
                              handleStatusUpdate(order._id, newStatus);
                            }
                          }}
                          className="h-8 px-2 text-sm border rounded-md bg-background"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="returned">Returned</option>
                        </select>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setOrderToDelete(order); setDeleteDialogOpen(true); }}
                          className="h-8 px-2 text-destructive hover:text-destructive"
                          title="Delete Order"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAndSortedOrders.length === 0 && (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">
                  {selectedStatus === 'cancelled' ? 'No cancelled orders found' : 'No orders found'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'Try adjusting your search criteria'
                    : selectedStatus === 'cancelled'
                      ? 'All cancelled orders have been processed'
                      : `No ${selectedStatus} orders found`
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Order Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Details: {selectedOrder.orderNumber}
                </DialogTitle>
                <DialogDescription>
                  Complete order information and customer details
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5" />
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <p className="text-sm">{selectedOrder.customerInfo.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </label>
                        <p className="text-sm">{selectedOrder.customerInfo.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Address
                        </label>
                        <p className="text-sm">
                          {selectedOrder.customerInfo.houseNumber}, {selectedOrder.customerInfo.street}<br />
                          {selectedOrder.customerInfo.upozela}, {selectedOrder.customerInfo.zela}<br />
                          Delivery: {selectedOrder.deliveryLocation}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="h-5 w-5" />
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Subtotal:</span>
                        <span className="text-sm font-medium">৳{selectedOrder.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Delivery Charge:</span>
                        <span className="text-sm font-medium">৳{selectedOrder.deliveryCharge}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-semibold">Grand Total:</span>
                        <span className="text-sm font-bold">৳{selectedOrder.grandTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Payment Method:</span>
                        <Badge variant={getPaymentBadgeVariant(selectedOrder.paymentMethod)}>
                          {selectedOrder.paymentMethod}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Order Status:</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedOrder.status)}
                          <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-sm">Tracking Number:</span>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {selectedOrder.trackingNumber}
                          </code>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Package className="h-5 w-5" />
                        Order Items ({selectedOrder.items.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex gap-3 border-b pb-4 last:border-0">
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              width={60}
                              height={60}
                              className="w-15 h-15 object-cover rounded-md border"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.product.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                Quantity: {item.quantity} × ৳{item.product.price}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: item.selectedColor }}
                                  title={item.selectedColorName}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {item.selectedColorName}
                                </span>
                              </div>
                              <p className="text-sm font-semibold mt-1">
                                ৳{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => printOrder(selectedOrder)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={() => sendSMSNotification(selectedOrder)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Shipping Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          {editingOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Ship Order: {editingOrder.orderNumber}
                </DialogTitle>
                <DialogDescription>
                  Add tracking number and mark order as shipped
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tracking Number</label>
                  <Input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="mt-1"
                  />
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    This will update the order status to &quot;Shipped&quot; and send a notification to the customer.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleStatusUpdate(editingOrder._id, 'shipped', trackingNumber);
                    setEditDialogOpen(false);
                  }}
                >
                  Mark as Shipped
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order &quot;{orderToDelete?.orderNumber}&quot; from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => orderToDelete && handleDelete(orderToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CancelledOrders;