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
  Filter,
  RefreshCw,
  ArrowUpDown,
  Tag,
  Hash,
  Info,
  Upload,
  X,
  Youtube,
  Palette,
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

const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    description: '',
    details: '',
    price: '',
    originalPrice: '',
    discount: 0,
    category: 'fashion',
    productTag: 'normal',
    stock: 0,
    colors: [],
    images: [],
    features: [],
    videoURL: ''
  });
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);
  const [newColor, setNewColor] = useState({ value: '#000000', name: '' });
  const [newFeature, setNewFeature] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const categories = ['all', 'fashion', 'electronics', 'home', 'beauty', 'sports', 'threepiece'];
  const productTags = ['normal', 'featured', 'sale', 'new', 'flash'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const loadingToast = toast.loading('Loading products...');
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);

      toast.success('Products loaded successfully!', {
        id: loadingToast,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products', {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index?: number, isNewProduct: boolean = false) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files).slice(0, 3);
    setUploadingImages(Array(filesArray.length).fill(true));

    try {
      const uploadPromises = filesArray.map(file => imageUpload(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      if (isNewProduct) {
        setNewProduct(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls].slice(0, 3)
        }));
      } else if (editingProduct) {
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
      if (addFileInputRef.current) addFileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number, isNewProduct: boolean = false) => {
    if (isNewProduct) {
      const updatedImages = [...newProduct.images];
      updatedImages.splice(index, 1);
      setNewProduct({
        ...newProduct,
        images: updatedImages
      });
    } else if (editingProduct) {
      const updatedImages = [...editingProduct.images];
      updatedImages.splice(index, 1);
      setEditingProduct({
        ...editingProduct,
        images: updatedImages
      });
    }
  };

  const addColor = (isNewProduct: boolean = false) => {
    if (!newColor.name.trim()) return;

    const colorExists = isNewProduct
      ? newProduct.colors.some(color => color.value === newColor.value || color.name === newColor.name)
      : editingProduct?.colors.some(color => color.value === newColor.value || color.name === newColor.name);

    if (colorExists) {
      toast.error('Color with same value or name already exists');
      return;
    }

    if (isNewProduct) {
      setNewProduct(prev => ({
        ...prev,
        colors: [...prev.colors, { ...newColor }]
      }));
    } else if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        colors: [...editingProduct.colors, { ...newColor }]
      });
    }

    setNewColor({ value: '#000000', name: '' });
    toast.success('Color added successfully!');
  };

  const removeColor = (index: number, isNewProduct: boolean = false) => {
    if (isNewProduct) {
      const updatedColors = [...newProduct.colors];
      updatedColors.splice(index, 1);
      setNewProduct({
        ...newProduct,
        colors: updatedColors
      });
    } else if (editingProduct) {
      const updatedColors = [...editingProduct.colors];
      updatedColors.splice(index, 1);
      setEditingProduct({
        ...editingProduct,
        colors: updatedColors
      });
    }
    toast.success('Color removed successfully!');
  };

  const addFeature = (isNewProduct: boolean = false) => {
    if (!newFeature.trim()) return;

    if (isNewProduct) {
      setNewProduct(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
    } else if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        features: [...editingProduct.features, newFeature.trim()]
      });
    }

    setNewFeature('');
    toast.success('Feature added successfully!');
  };

  const removeFeature = (index: number, isNewProduct: boolean = false) => {
    if (isNewProduct) {
      const updatedFeatures = [...newProduct.features];
      updatedFeatures.splice(index, 1);
      setNewProduct({
        ...newProduct,
        features: updatedFeatures
      });
    } else if (editingProduct) {
      const updatedFeatures = [...editingProduct.features];
      updatedFeatures.splice(index, 1);
      setEditingProduct({
        ...editingProduct,
        features: updatedFeatures
      });
    }
    toast.success('Feature removed successfully!');
  };

  const handleDelete = async (product: Product) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete &quot;${product.name}&quot;. This action cannot be undone!`,
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
      const response = await fetch(`http://localhost:8000/products/${product._id}`, {
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

  const handleSaveEdit = async () => {
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

    const saveToast = toast.loading('Updating product...');
    try {
      const response = await fetch(`http://localhost:8000/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      if (!response.ok) throw new Error('Failed to update product');

      setProducts(prev => prev.map(p => p._id === editingProduct._id ? editingProduct : p));
      setEditDialogOpen(false);
      setEditingProduct(null);

      toast.success('Product updated successfully!', { id: saveToast });
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product', { id: saveToast });
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }

    if (newProduct.images.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    const addToast = toast.loading('Adding product...');
    try {
      const response = await fetch('http://localhost:8000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) throw new Error('Failed to add product');

      const addedProduct = await response.json();
      setProducts(prev => [...prev, addedProduct]);
      setAddDialogOpen(false);
      resetNewProduct();

      toast.success('Product added successfully!', { id: addToast });
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product', { id: addToast });
    }
  };

  const resetNewProduct = () => {
    setNewProduct({
      name: '',
      description: '',
      details: '',
      price: '',
      originalPrice: '',
      discount: 0,
      category: 'fashion',
      productTag: 'normal',
      stock: 0,
      colors: [],
      images: [],
      features: [],
      videoURL: ''
    });
    setNewColor({ value: '#000000', name: '' });
    setNewFeature('');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setEditDialogOpen(true);
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

  const handleAddNewProduct = () => {
    setAddDialogOpen(true);
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (sortField === 'price' || sortField === 'originalPrice') {
        const aNum = parseFloat(aValue as string);
        const bNum = parseFloat(bValue as string);
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }

      return 0;
    });

  const getCategoryBadgeVariant = (category: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      fashion: 'default', electronics: 'secondary', home: 'outline',
      beauty: 'default', sports: 'secondary', threepiece: 'default',
    };
    return variants[category] || 'outline';
  };

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return 'destructive';
    if (stock < 10) return 'default';
    return 'outline';
  };

  const getTagBadgeVariant = (tag: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'outline' } = {
      normal: 'outline', featured: 'default', sale: 'secondary',
      new: 'default', flash: 'secondary',
    };
    return variants[tag] || 'outline';
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setViewDialogOpen(true);
  };

  // Fixed button handlers with proper TypeScript types
  const handleAddColorNewProduct = () => addColor(true);
  const handleAddColorEditProduct = () => addColor(false);
  const handleAddFeatureNewProduct = () => addFeature(true);
  const handleAddFeatureEditProduct = () => addFeature(false);

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
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground">Manage your product inventory and listings</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddNewProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader><CardContent><div className="text-2xl font-bold">{products.length}</div></CardContent>
        </Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{products.filter(p => p.stock < 10).length}</div></CardContent>
        </Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{products.filter(p => p.stock === 0).length}</div></CardContent>
        </Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <Filter className="h-4 w-4 text-muted-foreground" />
        </CardHeader><CardContent><div className="text-2xl font-bold">{new Set(products.map(p => p.category)).size}</div></CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card><CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products by name or category..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background">
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </CardContent>
      </Card>

      {/* Products Table */}
      <Card><CardHeader><CardTitle>Product List</CardTitle></CardHeader>
        <CardContent><div className="rounded-md border">
          <Table><TableHeader><TableRow>
            <TableHead className="w-[250px]"><Button variant="ghost" onClick={() => handleSort('name')}
              className="p-0 hover:bg-transparent font-semibold">Product<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
            <TableHead><Button variant="ghost" onClick={() => handleSort('category')}
              className="p-0 hover:bg-transparent font-semibold">Category<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
            <TableHead><Button variant="ghost" onClick={() => handleSort('price')}
              className="p-0 hover:bg-transparent font-semibold">Price<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
            <TableHead><Button variant="ghost" onClick={() => handleSort('stock')}
              className="p-0 hover:bg-transparent font-semibold">Stock<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
            <TableHead className="font-semibold">Tag</TableHead>
            <TableHead className="font-semibold">Colors</TableHead>
            <TableHead className="text-right font-semibold w-[150px]">Actions</TableHead>
          </TableRow></TableHeader>
            <TableBody>{filteredAndSortedProducts.map((product) => (
              <TableRow key={product._id} className="hover:bg-muted/50">
                <TableCell className="font-medium"><div className="flex items-center gap-3">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-md object-cover border"
                  />
                  <div className="flex-1 min-w-0"><p className="font-semibold truncate">{product.name}</p></div>
                </div></TableCell>
                <TableCell><Badge variant={getCategoryBadgeVariant(product.category)}>{product.category}</Badge></TableCell>
                <TableCell><div className="flex flex-col"><span className="font-semibold">${product.price}</span>
                  {product.discount > 0 && <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>}
                </div></TableCell>
                <TableCell><Badge variant={getStockBadgeVariant(product.stock)}>{product.stock} in stock</Badge></TableCell>
                <TableCell><Badge variant={getTagBadgeVariant(product.productTag)}>{product.productTag}</Badge></TableCell>
                <TableCell><div className="flex gap-1">{product.colors.slice(0, 3).map((color, index) => (
                  <div key={index} className="w-4 h-4 rounded-full border" style={{ backgroundColor: color.value }} title={color.name} />
                ))}{product.colors.length > 3 && <div className="text-xs text-muted-foreground">+{product.colors.length - 3}</div>}
                </div></TableCell>
                <TableCell className="text-right"><div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(product)} className="h-8 px-2"><Info className="h-3 w-3" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)} className="h-8 px-2"><Edit className="h-3 w-3" /></Button>
                  <Button variant="outline" size="sm" onClick={() => { setProductToDelete(product); setDeleteDialogOpen(true); }}
                    className="h-8 px-2 text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                </div></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-8"><Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No products found</h3><p className="text-muted-foreground">
                {searchTerm || selectedCategory !== 'all' ? 'Try adjusting your search or filter criteria' : 'Get started by adding your first product'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Add New Product</DialogTitle>
            <DialogDescription>Create a new product listing</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Product Name and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Product Name *</label>
                <Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="mt-1" placeholder="Enter product name" />
              </div>
              <div><label className="text-sm font-medium">Category *</label>
                <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description and Details - Full Width */}
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Description *</label>
                <textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={3} className="w-full border rounded-md px-3 py-2 text-sm mt-1" placeholder="Enter product description" />
              </div>
              <div><label className="text-sm font-medium">Details</label>
                <textarea value={newProduct.details} onChange={(e) => setNewProduct({ ...newProduct, details: e.target.value })}
                  rows={2} className="w-full border rounded-md px-3 py-2 text-sm mt-1" placeholder="Enter product details" />
              </div>
            </div>

            {/* Pricing and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div><label className="text-sm font-medium">Price *</label>
                <Input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="mt-1" placeholder="0.00" min="0" step="0.01" />
              </div>
              <div><label className="text-sm font-medium">Original Price</label>
                <Input type="number" value={newProduct.originalPrice} onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                  className="mt-1" placeholder="0.00" min="0" step="0.01" />
              </div>
              <div><label className="text-sm font-medium">Discount (%)</label>
                <Input type="number" value={newProduct.discount} onChange={(e) => setNewProduct({ ...newProduct, discount: parseInt(e.target.value) || 0 })}
                  className="mt-1" placeholder="0" min="0" max="100" />
              </div>
              <div><label className="text-sm font-medium">Stock *</label>
                <Input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                  className="mt-1" placeholder="0" min="0" />
              </div>
            </div>

            {/* Product Tag */}
            <div><label className="text-sm font-medium">Product Tag</label>
              <select value={newProduct.productTag} onChange={(e) => setNewProduct({ ...newProduct, productTag: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                {productTags.map(tag => <option key={tag} value={tag}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</option>)}
              </select>
            </div>

            {/* Image Upload */}
            <div><label className="text-sm font-medium">Product Images * (Max 3)</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[0, 1, 2].map((index) => (<div key={index} className="relative">
                  {newProduct.images[index] ? (<>
                    <Image
                      src={newProduct.images[index]}
                      alt={`Product ${index + 1}`}
                      width={100}
                      height={80}
                      className="w-full h-20 object-cover rounded-md border"
                    />
                    <Button variant="destructive" size="sm" className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      onClick={() => removeImage(index, true)}><X className="h-3 w-3" /></Button>
                  </>) : (<div className="w-full h-20 border-2 border-dashed border-muted-foreground/25 rounded-md flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => addFileInputRef.current?.click()}><input type="file" ref={addFileInputRef} onChange={(e) => handleImageUpload(e, index, true)} accept="image/*" className="hidden" />
                    {uploadingImages[index] ? <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
                  </div>)}
                </div>))}
              </div>
              <div className="mt-2"><input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, undefined, true)} className="hidden" id="add-image-upload" />
                <Button variant="outline" size="sm" onClick={() => document.getElementById('add-image-upload')?.click()}
                  disabled={newProduct.images.length >= 3}><Upload className="h-4 w-4 mr-2" />Upload Images ({newProduct.images.length}/3)</Button>
              </div>
            </div>

            {/* YouTube URL */}
            <div><label className="text-sm font-medium flex items-center gap-2"><Youtube className="h-4 w-4 text-red-600" />YouTube Video URL</label>
              <Input value={newProduct.videoURL || ''} onChange={(e) => setNewProduct({ ...newProduct, videoURL: e.target.value })}
                className="mt-1" placeholder="https://www.youtube.com/embed/..." />
            </div>

            {/* Color Management */}
            <div><label className="text-sm font-medium flex items-center gap-2"><Palette className="h-4 w-4" />Product Colors</label>
              <div className="flex gap-2 mt-2">
                <input type="color" value={newColor.value} onChange={(e) => setNewColor({ ...newColor, value: e.target.value })} className="w-10 h-10 rounded border" />
                <Input value={newColor.name} onChange={(e) => setNewColor({ ...newColor, name: e.target.value })} placeholder="Color name" className="flex-1" />
                <Button onClick={handleAddColorNewProduct} disabled={!newColor.name.trim()} size="sm"><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="mt-2 space-y-2">{newProduct.colors.map((color, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: color.value }} />
                    <span className="text-sm">{color.name}</span><code className="text-xs text-muted-foreground">{color.value}</code>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeColor(index, true)} className="h-6 w-6 p-0 text-destructive"><X className="h-3 w-3" /></Button>
                </div>
              ))}</div>
            </div>

            {/* Features Management */}
            <div><label className="text-sm font-medium">Product Features</label>
              <div className="flex gap-2 mt-2">
                <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Enter feature" className="flex-1" />
                <Button onClick={handleAddFeatureNewProduct} disabled={!newFeature.trim()} size="sm"><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="mt-2 space-y-2">{newProduct.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{feature}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeFeature(index, true)} className="h-6 w-6 p-0 text-destructive"><X className="h-3 w-3" /></Button>
                </div>
              ))}</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddDialogOpen(false); resetNewProduct(); }}>Cancel</Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editingProduct && (<>
            <DialogHeader><DialogTitle className="flex items-center gap-2"><Edit className="h-5 w-5" />Edit Product: {editingProduct.name}</DialogTitle>
              <DialogDescription>Update product information and details</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Product Name and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium">Product Name *</label>
                  <Input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="mt-1" placeholder="Enter product name" />
                </div>
                <div><label className="text-sm font-medium">Category *</label>
                  <select value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description and Details - Full Width */}
              <div className="space-y-4">
                <div><label className="text-sm font-medium">Description *</label>
                  <textarea value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    rows={3} className="w-full border rounded-md px-3 py-2 text-sm mt-1" placeholder="Enter product description" />
                </div>
                <div><label className="text-sm font-medium">Details</label>
                  <textarea value={editingProduct.details} onChange={(e) => setEditingProduct({ ...editingProduct, details: e.target.value })}
                    rows={2} className="w-full border rounded-md px-3 py-2 text-sm mt-1" placeholder="Enter product details" />
                </div>
              </div>

              {/* Pricing and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div><label className="text-sm font-medium">Price *</label>
                  <Input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="mt-1" placeholder="0.00" min="0" step="0.01" />
                </div>
                <div><label className="text-sm font-medium">Original Price</label>
                  <Input type="number" value={editingProduct.originalPrice} onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                    className="mt-1" placeholder="0.00" min="0" step="0.01" />
                </div>
                <div><label className="text-sm font-medium">Discount (%)</label>
                  <Input type="number" value={editingProduct.discount} onChange={(e) => setEditingProduct({ ...editingProduct, discount: parseInt(e.target.value) || 0 })}
                    className="mt-1" placeholder="0" min="0" max="100" />
                </div>
                <div><label className="text-sm font-medium">Stock *</label>
                  <Input type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="mt-1" placeholder="0" min="0" />
                </div>
              </div>

              {/* Product Tag */}
              <div><label className="text-sm font-medium">Product Tag</label>
                <select value={editingProduct.productTag} onChange={(e) => setEditingProduct({ ...editingProduct, productTag: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                  {productTags.map(tag => <option key={tag} value={tag}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</option>)}
                </select>
              </div>

              {/* Image Upload */}
              <div><label className="text-sm font-medium">Product Images * (Max 3)</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[0, 1, 2].map((index) => (<div key={index} className="relative">
                    {editingProduct.images[index] ? (<>
                      <Image
                        src={editingProduct.images[index]}
                        alt={`Product ${index + 1}`}
                        width={100}
                        height={80}
                        className="w-full h-20 object-cover rounded-md border"
                      />
                      <Button variant="destructive" size="sm" className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={() => removeImage(index)}><X className="h-3 w-3" /></Button>
                    </>) : (<div className="w-full h-20 border-2 border-dashed border-muted-foreground/25 rounded-md flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}><input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e, index)} accept="image/*" className="hidden" />
                      {uploadingImages[index] ? <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
                    </div>)}
                  </div>))}
                </div>
                <div className="mt-2"><input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="edit-image-upload" />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('edit-image-upload')?.click()}
                    disabled={editingProduct.images.length >= 3}><Upload className="h-4 w-4 mr-2" />Upload Images ({editingProduct.images.length}/3)</Button>
                </div>
              </div>

              {/* YouTube URL */}
              <div><label className="text-sm font-medium flex items-center gap-2"><Youtube className="h-4 w-4 text-red-600" />YouTube Video URL</label>
                <Input value={editingProduct.videoURL || ''} onChange={(e) => setEditingProduct({ ...editingProduct, videoURL: e.target.value })}
                  className="mt-1" placeholder="https://www.youtube.com/embed/..." />
              </div>

              {/* Color Management */}
              <div><label className="text-sm font-medium flex items-center gap-2"><Palette className="h-4 w-4" />Product Colors</label>
                <div className="flex gap-2 mt-2">
                  <input type="color" value={newColor.value} onChange={(e) => setNewColor({ ...newColor, value: e.target.value })} className="w-10 h-10 rounded border" />
                  <Input value={newColor.name} onChange={(e) => setNewColor({ ...newColor, name: e.target.value })} placeholder="Color name" className="flex-1" />
                  <Button onClick={handleAddColorEditProduct} disabled={!newColor.name.trim()} size="sm"><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="mt-2 space-y-2">{editingProduct.colors.map((color, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded border" style={{ backgroundColor: color.value }} />
                      <span className="text-sm">{color.name}</span><code className="text-xs text-muted-foreground">{color.value}</code>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeColor(index)} className="h-6 w-6 p-0 text-destructive"><X className="h-3 w-3" /></Button>
                  </div>
                ))}</div>
              </div>

              {/* Features Management */}
              <div><label className="text-sm font-medium">Product Features</label>
                <div className="flex gap-2 mt-2">
                  <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Enter feature" className="flex-1" />
                  <Button onClick={handleAddFeatureEditProduct} disabled={!newFeature.trim()} size="sm"><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="mt-2 space-y-2">{editingProduct.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{feature}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeFeature(index)} className="h-6 w-6 p-0 text-destructive"><X className="h-3 w-3" /></Button>
                  </div>
                ))}</div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </>)}
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (<>
            <DialogHeader><DialogTitle className="flex items-center gap-2"><Package className="h-5 w-5" />{selectedProduct.name}</DialogTitle>
              <DialogDescription>Complete product details and information</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Image
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  width={400}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg mb-4 border"
                />
                <div className="grid grid-cols-3 gap-2">{selectedProduct.images.slice(1).map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`${selectedProduct.name} ${index + 2}`}
                    width={100}
                    height={80}
                    className="w-full h-20 object-cover rounded-md border"
                  />
                ))}</div>
                {selectedProduct.videoURL && (<div className="mt-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><Youtube className="h-4 w-4 text-red-600" />Product Video</h4>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center"><iframe src={selectedProduct.videoURL} className="w-full h-full rounded-lg" allowFullScreen /></div>
                </div>)}
              </div>
              <div className="space-y-4">
                <div><h4 className="font-semibold mb-2">Description</h4><p className="text-sm text-muted-foreground">{selectedProduct.description}</p></div>
                <div><h4 className="font-semibold mb-2">Details</h4><p className="text-sm text-muted-foreground">{selectedProduct.details}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><h4 className="font-semibold mb-2">Price</h4><div className="flex items-center gap-2"><span className="text-2xl font-bold">${selectedProduct.price}</span>
                    {selectedProduct.discount > 0 && (<><span className="text-lg text-muted-foreground line-through">${selectedProduct.originalPrice}</span>
                      <Badge variant="secondary">{selectedProduct.discount}% OFF</Badge></>)}</div></div>
                  <div><h4 className="font-semibold mb-2">Stock</h4><Badge variant={getStockBadgeVariant(selectedProduct.stock)}>{selectedProduct.stock} units</Badge></div>
                </div>
                <div><h4 className="font-semibold mb-2">Colors</h4><div className="flex gap-2 flex-wrap">{selectedProduct.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2"><div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color.value }} />
                    <span className="text-sm">{color.name}</span></div>
                ))}</div></div>
                <div><h4 className="font-semibold mb-2">Features</h4><ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  {selectedProduct.features.map((feature, index) => (<li key={index}>{feature}</li>))}</ul></div>
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
              <Button onClick={() => handleEditProduct(selectedProduct)}>Edit Product</Button>
            </DialogFooter>
          </>)}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the product &quot;{productToDelete?.name}&quot; from your inventory.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => productToDelete && handleDelete(productToDelete)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AllProducts;