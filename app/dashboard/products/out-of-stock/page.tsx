'use client';
import React, { useState, useEffect, useRef } from 'react';
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
  Plus,
  Edit,
  Trash2,
  Package,
  RefreshCw,
  ArrowUpDown,
  Info,
  AlertTriangle,
  Download,
  Save,
  X,
  Palette,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import Image from 'next/image';

interface ProductColor {
  value: string;
  name: string;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  details: string;
  price: string;
  originalPrice: string;
  discount: number;
  category: string;
  productTag: string;
  stock: number;
  colors: ProductColor[];
  images: string[];
  videoURL?: string;
  features: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Image upload function
const imageUpload = async (image: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await fetch('https://api.imgbb.com/1/upload?key=19c9072b07556f7849d6dea75b7e834d', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return data.data.display_url;
};

const OutOfStock = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);
  const [newColor, setNewColor] = useState({ value: '#000000', name: '' });
  const [newFeature, setNewFeature] = useState('');
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const categories = ['fashion', 'electronics', 'home', 'beauty', 'sports', 'threepiece'];
  const productTags = ['normal', 'featured', 'sale', 'new', 'flash'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const loadingToast = toast.loading('Loading out of stock products...');
    try {
      setLoading(true);
      const response = await fetch('https://all-mart-avenue-backend.vercel.app/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      toast.success('Products loaded successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files).slice(0, 3);
    setUploadingImages(Array(filesArray.length).fill(true));

    try {
      const uploadPromises = filesArray.map(file => imageUpload(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      if (editingProduct) {
        const updatedImages = index !== undefined
          ? [...editingProduct.images]
          : [...editingProduct.images, ...uploadedUrls];

        if (index !== undefined && index < updatedImages.length) {
          updatedImages[index] = uploadedUrls[0];
        }

        setEditingProduct({
          ...editingProduct,
          images: updatedImages.slice(0, 3)
        });
      }

      toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)!`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    if (editingProduct) {
      const updatedImages = [...editingProduct.images];
      updatedImages.splice(index, 1);
      setEditingProduct({
        ...editingProduct,
        images: updatedImages
      });
    }
  };

  const addColor = () => {
    if (!newColor.name.trim()) return;

    const colorExists = editingProduct?.colors.some(color => color.value === newColor.value || color.name === newColor.name);

    if (colorExists) {
      toast.error('Color with same value or name already exists');
      return;
    }

    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        colors: [...editingProduct.colors, { ...newColor }]
      });
    }

    setNewColor({ value: '#000000', name: '' });
    toast.success('Color added successfully!');
  };

  const removeColor = (index: number) => {
    if (editingProduct) {
      const updatedColors = [...editingProduct.colors];
      updatedColors.splice(index, 1);
      setEditingProduct({
        ...editingProduct,
        colors: updatedColors
      });
    }
    toast.success('Color removed successfully!');
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;

    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        features: [...editingProduct.features, newFeature.trim()]
      });
    }

    setNewFeature('');
    toast.success('Feature added successfully!');
  };

  const removeFeature = (index: number) => {
    if (editingProduct) {
      const updatedFeatures = [...editingProduct.features];
      updatedFeatures.splice(index, 1);
      setEditingProduct({
        ...editingProduct,
        features: updatedFeatures
      });
    }
    toast.success('Feature removed successfully!');
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    if (!editingProduct.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!editingProduct.price || parseFloat(editingProduct.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }

    if (editingProduct.images.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    setSaving(true);
    const updateToast = toast.loading('Updating product...');

    try {
      const response = await fetch(`https://all-mart-avenue-backend.vercel.app/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      });

      if (!response.ok) throw new Error('Failed to update product');


      setProducts(prev => prev.map(product =>
        product._id === editingProduct._id ? { ...editingProduct } : product
      ));

      toast.success('Product updated successfully!', { id: updateToast });
      setEditDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product', { id: updateToast });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete product "${product.name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      toast('Product deletion cancelled', { icon: 'ℹ️' });
      return;
    }

    const deleteToast = toast.loading('Deleting product...');
    try {
      const response = await fetch(`https://all-mart-avenue-backend.vercel.app/products/${product._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      setProducts(prev => prev.filter(p => p._id !== product._id));

      await Swal.fire({
        title: 'Deleted!',
        text: 'Product has been deleted successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      toast.success('Product deleted successfully!', { id: deleteToast });
    } catch (error) {
      console.error('Error deleting product:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to delete product. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3b82f6',
      });
      toast.error('Failed to delete product', { id: deleteToast });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = () => {
    toast.promise(fetchProducts(), {
      loading: 'Refreshing products...',
      success: 'Products refreshed successfully!',
      error: 'Failed to refresh products',
    });
  };

  const formatPrice = (price: string) => {
    return `৳${price}`;
  };

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return 'destructive';
    if (stock <= 10) return 'outline';
    return 'default';
  };

  const getStockBadgeText = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 10) return `Low Stock (${stock})`;
    return `In Stock (${stock})`;
  };

  const exportProducts = () => {
    const outOfStockProducts = products.filter(product => product.stock === 0);
    const dataToExport = outOfStockProducts.map(product => ({
      'Product Name': product.name,
      'Category': product.category,
      'Price': formatPrice(product.price),
      'Original Price': formatPrice(product.originalPrice),
      'Discount': `${product.discount}%`,
      'Stock': product.stock,
      'Product Tag': product.productTag,
    }));

    const csv = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `out-of-stock-products-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Out of stock products exported successfully!');
  };

  const getSortValue = (product: Product, field: keyof Product) => {
    switch (field) {
      case 'price':
      case 'originalPrice':
        return parseFloat(product[field] as string);
      case 'stock':
      case 'discount':
        return product[field] as number;
      case 'name':
      case 'category':
      case 'productTag':
        return (product[field] as string).toLowerCase();
      default:
        return product[field] as string | number;
    }
  };

  const outOfStockProducts = products.filter(product => product.stock === 0);

  const filteredAndSortedProducts = outOfStockProducts
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productTag.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
    totalOutOfStock: outOfStockProducts.length,
    totalProducts: products.length,
    lowStock: products.filter(product => product.stock > 0 && product.stock <= 10).length,
    inStock: products.filter(product => product.stock > 10).length,
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Out of Stock Products</h1>
          <p className="text-muted-foreground">Manage and monitor products that are out of stock</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportProducts}>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.totalOutOfStock}</div>
            <p className="text-xs text-red-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search out of stock products by name, category, or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Out of Stock Products ({filteredAndSortedProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <Button variant="ghost" onClick={() => handleSort('name')} className="p-0 hover:bg-transparent font-semibold">
                      Product
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('category')} className="p-0 hover:bg-transparent font-semibold">
                      Category
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('price')} className="p-0 hover:bg-transparent font-semibold">
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('productTag')} className="p-0 hover:bg-transparent font-semibold">
                      Tag
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProducts.map((product) => (
                  <TableRow key={product._id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="w-12 h-12 object-cover rounded-md border"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-xs text-muted-foreground line-clamp-2">
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{formatPrice(product.price)}</span>
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        {product.discount}% OFF
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStockBadgeVariant(product.stock)}>
                        {getStockBadgeText(product.stock)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {product.productTag}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedProduct(product); setViewDialogOpen(true); }} className="h-8 px-2" title="View Details">
                          <Info className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => { setEditingProduct(product); setEditDialogOpen(true); }} className="h-8 px-2" title="Edit Product">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setProductToDelete(product); setDeleteDialogOpen(true); }}
                          className="h-8 px-2 text-destructive hover:text-destructive"
                          title="Delete Product"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">
                  {searchTerm ? 'No matching products found' : 'No out of stock products'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'Try adjusting your search criteria'
                    : 'All products are currently in stock'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Product Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Details: {selectedProduct.name}
                </DialogTitle>
                <DialogDescription>
                  Complete product information and specifications
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Images */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Product Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedProduct.images.map((image, index) => (
                          <Image
                            key={index}
                            src={image}
                            alt={`${selectedProduct.name} ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-32 object-cover rounded-md border"
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Product Colors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Available Colors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.colors.map((color, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full border"
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                            <span className="text-sm">{color.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Product Information */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Product Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <p className="text-sm">{selectedProduct.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <p className="text-sm">{selectedProduct.description}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Details</label>
                        <p className="text-sm">{selectedProduct.details}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Category</label>
                          <Badge variant="outline" className="mt-1 capitalize">
                            {selectedProduct.category}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Product Tag</label>
                          <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700">
                            {selectedProduct.productTag}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pricing & Stock */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pricing & Stock</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Current Price:</span>
                        <span className="text-sm font-medium">{formatPrice(selectedProduct.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Original Price:</span>
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(selectedProduct.originalPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Discount:</span>
                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                          {selectedProduct.discount}% OFF
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Stock Status:</span>
                        <Badge variant={getStockBadgeVariant(selectedProduct.stock)}>
                          {getStockBadgeText(selectedProduct.stock)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Features */}
                  {selectedProduct.features && selectedProduct.features.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {selectedProduct.features.map((feature, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <div className="w-1 h-1 bg-blue-500 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => { setEditingProduct(selectedProduct); setEditDialogOpen(true); setViewDialogOpen(false); }}>
                  Edit Product
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editingProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit Product: {editingProduct.name}
                </DialogTitle>
                <DialogDescription>
                  Update product information and stock details
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Product Name and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Name *</label>
                    <Input
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="Product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category *</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description and Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description *</label>
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      placeholder="Product description"
                      className="w-full min-h-[80px] p-2 border rounded-md resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Details</label>
                    <textarea
                      value={editingProduct.details}
                      onChange={(e) => setEditingProduct({ ...editingProduct, details: e.target.value })}
                      placeholder="Product details"
                      className="w-full min-h-[60px] p-2 border rounded-md resize-none"
                    />
                  </div>
                </div>

                {/* Pricing and Stock */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Price *</label>
                    <Input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      placeholder="Price"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Original Price</label>
                    <Input
                      type="number"
                      value={editingProduct.originalPrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                      placeholder="Original price"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discount (%)</label>
                    <Input
                      type="number"
                      value={editingProduct.discount}
                      onChange={(e) => setEditingProduct({ ...editingProduct, discount: parseInt(e.target.value) || 0 })}
                      placeholder="Discount percentage"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock Quantity*</label>
                    <Input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                      placeholder="Stock quantity"
                    />
                  </div>
                </div>

                {/* Product Tag */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Tag</label>
                  <select
                    value={editingProduct.productTag}
                    onChange={(e) => setEditingProduct({ ...editingProduct, productTag: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    {productTags.map(tag => (
                      <option key={tag} value={tag}>
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Images * (Max 3)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="relative">
                        {editingProduct.images[index] ? (
                          <>
                            <Image
                              src={editingProduct.images[index]}
                              alt={`Product ${index + 1}`}
                              width={100}
                              height={80}
                              className="w-full h-20 object-cover rounded-md border"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <div
                            className="w-full h-20 border-2 border-dashed border-muted-foreground/25 rounded-md flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={(e) => handleImageUpload(e, index)}
                              accept="image/*"
                              className="hidden"
                            />
                            {uploadingImages[index] ? (
                              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e)}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('edit-image-upload')?.click()}
                      disabled={editingProduct.images.length >= 3}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload Images ({editingProduct.images.length}/3)
                    </Button>
                  </div>
                </div>

                {/* YouTube URL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">YouTube Video URL</label>
                  <Input
                    value={editingProduct.videoURL || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, videoURL: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>

                {/* Color Management */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Product Colors
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newColor.value}
                      onChange={(e) => setNewColor({ ...newColor, value: e.target.value })}
                      className="w-10 h-10 rounded border"
                    />
                    <Input
                      value={newColor.name}
                      onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                      placeholder="Color name"
                      className="flex-1"
                    />
                    <Button onClick={addColor} disabled={!newColor.name.trim()} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {editingProduct.colors.map((color, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color.value }}
                          />
                          <span className="text-sm">{color.name}</span>
                          <code className="text-xs text-muted-foreground">{color.value}</code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeColor(index)}
                          className="h-6 w-6 p-0 text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Management */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Features</label>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Enter feature"
                      className="flex-1"
                    />
                    <Button onClick={addFeature} disabled={!newFeature.trim()} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {editingProduct.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{feature}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index)}
                          className="h-6 w-6 p-0 text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Updating stock from 0 will remove this product from the out of stock list.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateProduct} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
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
              This action cannot be undone. This will permanently delete the product &quot;{productToDelete?.name}&quot; from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => productToDelete && handleDelete(productToDelete)}
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

export default OutOfStock;