'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Menu,
  Package,
  ShoppingCart,
  Image,
  Home,
  X,
  User,
  LogOut,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  Sparkles,
  Clock,
  GripVertical,
  Truck,
  RotateCcw,
  Ban,
  RefreshCw,
} from 'lucide-react';

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  image: string;
}

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
}

interface Order {
  _id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  orderNumber: string;
}

interface SubMenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge: number | null;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge: number | null;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, badge: null },
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: Package,
    badge: null,
    subItems: [
      { name: 'All Products', href: '/dashboard/products', icon: Package, badge: null },
      { name: 'Out of Stock', href: '/dashboard/products/out-of-stock', icon: AlertTriangle, badge: null },
    ],
  },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingCart,
    badge: 0,
    subItems: [
      { name: 'All Orders', href: '/dashboard/orders', icon: ShoppingCart, badge: 0 },
      { name: 'Pending Orders', href: '/dashboard/orders/pending', icon: Clock, badge: 0 },
      { name: 'Confirmed Orders', href: '/dashboard/orders/confirmed', icon: CheckCircle, badge: 0 },
      { name: 'Shipped Orders', href: '/dashboard/orders/shipped', icon: Truck, badge: 0 },
      { name: 'Delivered Orders', href: '/dashboard/orders/delivered', icon: CheckCircle, badge: 0 },
      { name: 'Cancelled Orders', href: '/dashboard/orders/cancelled', icon: Ban, badge: 0 },
      { name: 'Returned Orders', href: '/dashboard/orders/returned', icon: RotateCcw, badge: 0 },
    ],
  },
  { name: 'Banners', href: '/dashboard/banners', icon: Image, badge: 0 },
];

const sidebarVariants = { hidden: { x: -300, opacity: 0 }, visible: { x: 0, opacity: 1 } };
const itemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };
const subItemVariants = { hidden: { opacity: 0, height: 0 }, visible: { opacity: 1, height: 'auto' } };

interface NavItemProps {
  item: MenuItem;
  index: number;
  isActive: boolean;
  hasSubItems: boolean;
  expandedItems: string[];
  toggleExpanded: (name: string) => void;
  mobile: boolean;
  setOpen: (open: boolean) => void;
}

interface SidebarProps {
  onLogout?: () => void;
}

const NavItem = ({ item, index, isActive, hasSubItems, expandedItems, toggleExpanded, mobile, setOpen }: NavItemProps) => {
  const Icon = item.icon;
  const pathname = usePathname();

  if (hasSubItems) {
    return (
      <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 + index * 0.1, duration: 0.4, ease: 'easeOut' }}>
        <Button variant={isActive ? 'secondary' : 'ghost'} className="w-full justify-between group relative overflow-hidden" onClick={() => toggleExpanded(item.name)}>
          {isActive && (
            <motion.div className="absolute inset-0 bg-blue-100 rounded-md" layoutId="activeBackground" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
          )}
          <div className="flex items-center space-x-3 z-10 relative">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}>
              <Icon className="h-4 w-4" />
            </motion.div>
            <span className="font-medium">{item.name}</span>
          </div>
          <div className="flex items-center space-x-2 z-10 relative">
            {item.badge && item.badge > 0 && <Badge variant="default" className="h-5 px-1 text-xs bg-red-500">{item.badge}</Badge>}
            <motion.div animate={{ rotate: expandedItems.includes(item.name) ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </div>
        </Button>

        <AnimatePresence>
          {expandedItems.includes(item.name) && (
            <motion.div variants={subItemVariants} initial="hidden" animate="visible" exit="hidden" transition={{ duration: 0.3, ease: 'easeOut' }} className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
              {item.subItems?.map((subItem, subIndex) => {
                const SubIcon = subItem.icon;
                const isSubActive = pathname === subItem.href;
                return (
                  <motion.div key={subItem.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: subIndex * 0.05, duration: 0.3 }}>
                    <Link href={subItem.href} onClick={() => mobile && setOpen(false)}>
                      <Button variant={isSubActive ? 'secondary' : 'ghost'} className="w-full justify-start text-sm group relative">
                        {isSubActive && (
                          <motion.div className="absolute inset-0 bg-blue-50 rounded-md" layoutId="activeSubBackground" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                        )}
                        <div className="flex items-center space-x-2 z-10 relative">
                          <SubIcon className="h-3 w-3" />
                          <span>{subItem.name}</span>
                        </div>
                        {subItem.badge && subItem.badge > 0 && <Badge variant="outline" className="h-4 px-1 text-xs ml-auto z-10">{subItem.badge}</Badge>}
                      </Button>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 + index * 0.1, duration: 0.4, ease: 'easeOut' }}>
      <Link href={item.href} onClick={() => mobile && setOpen(false)}>
        <Button variant={isActive ? 'secondary' : 'ghost'} className="w-full justify-start group relative overflow-hidden">
          {isActive && <motion.div className="absolute inset-0 bg-blue-100 rounded-md" layoutId="activeBackground" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />}
          <div className="flex items-center space-x-3 z-10 relative">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}>
              <Icon className="h-4 w-4" />
            </motion.div>
            <span className="font-medium">{item.name}</span>
          </div>
          {item.badge !== null && item.badge > 0 && <Badge variant="default" className={`h-5 px-1 text-xs ml-auto z-10 ${item.name === 'Banners' ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-red-500'}`}>{item.badge}</Badge>}
        </Button>
      </Link>
    </motion.div>
  );
};

const NavContent = ({ mobile = false, setOpen, width = 320, onLogout }: { mobile?: boolean; setOpen: (open: boolean) => void; width?: number; onLogout?: () => void }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Products']);
  const [bannersCount, setBannersCount] = useState<number>(0);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [outOfStockCount, setOutOfStockCount] = useState<number>(0);
  const [ordersCount, setOrdersCount] = useState<{
    all: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    returned: number;
  }>({
    all: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const pathname = usePathname();

  const fetchBannersCount = useCallback(async () => {
    try {
      const response = await axios.get<Banner[]>('https://all-mart-avenue-backend.vercel.app/banners');
      setBannersCount(response.data.length);
    } catch {
      setBannersCount(0);
    }
  }, []);

  const fetchProductsCount = useCallback(async () => {
    try {
      const response = await axios.get<Product[]>('https://all-mart-avenue-backend.vercel.app/products');
      const products = response.data;
      setProductsCount(products.length);
      const outOfStockProducts = products.filter(product => product.stock === 0);
      setOutOfStockCount(outOfStockProducts.length);
    } catch {
      setProductsCount(0);
      setOutOfStockCount(0);
    }
  }, []);

  const fetchOrdersCount = useCallback(async () => {
    try {
      const response = await axios.get<Order[]>('https://all-mart-avenue-backend.vercel.app/orders');
      const orders = response.data;

      setOrdersCount({
        all: orders.length,
        pending: orders.filter(order => order.status === 'pending').length,
        confirmed: orders.filter(order => order.status === 'confirmed').length,
        shipped: orders.filter(order => order.status === 'shipped').length,
        delivered: orders.filter(order => order.status === 'delivered').length,
        cancelled: orders.filter(order => order.status === 'cancelled').length,
        returned: orders.filter(order => order.status === 'returned').length
      });
    } catch {
      setOrdersCount({
        all: 0,
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        returned: 0
      });
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([fetchBannersCount(), fetchProductsCount(), fetchOrdersCount()]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchBannersCount, fetchProductsCount, fetchOrdersCount]);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const updatedMenuItems = menuItems.map(item => {
    if (item.name === 'Products') {
      return {
        ...item,
        badge: productsCount,
        subItems: item.subItems?.map(subItem => {
          if (subItem.name === 'All Products') {
            return { ...subItem, badge: productsCount };
          }
          if (subItem.name === 'Out of Stock') {
            return { ...subItem, badge: outOfStockCount };
          }
          return subItem;
        })
      };
    }
    if (item.name === 'Orders') {
      return {
        ...item,
        badge: ordersCount.pending,
        subItems: item.subItems?.map(subItem => {
          if (subItem.name === 'All Orders') return { ...subItem, badge: ordersCount.all };
          if (subItem.name === 'Pending Orders') return { ...subItem, badge: ordersCount.pending };
          if (subItem.name === 'Confirmed Orders') return { ...subItem, badge: ordersCount.confirmed };
          if (subItem.name === 'Shipped Orders') return { ...subItem, badge: ordersCount.shipped };
          if (subItem.name === 'Delivered Orders') return { ...subItem, badge: ordersCount.delivered };
          if (subItem.name === 'Cancelled Orders') return { ...subItem, badge: ordersCount.cancelled };
          if (subItem.name === 'Returned Orders') return { ...subItem, badge: ordersCount.returned };
          return subItem;
        })
      };
    }
    if (item.name === 'Banners') {
      return { ...item, badge: bannersCount };
    }
    return item;
  });

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => (prev.includes(itemName) ? prev.filter(item => item !== itemName) : [...prev, itemName]));
  };

  const isActive = (href: string) => pathname === href;
  const isSubItemActive = (subItems: SubMenuItem[] = []) => subItems.some(subItem => pathname === subItem.href);
  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <motion.div className={`flex flex-col h-screen ${mobile ? '' : 'fixed left-0 top-0'}`} variants={sidebarVariants} initial="hidden" animate="visible" transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.6 }} style={!mobile ? { width: `${width}px` } : {}}>
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center space-x-3">
          <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.8, ease: 'easeInOut' }}>
            <Avatar className="h-10 w-10 bg-white/20 border-2 border-white/30">
              <AvatarFallback className="bg-transparent text-white">
                <Zap className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              AllMart <Sparkles className="h-4 w-4" />
            </h2>
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
              Admin Dashboard
            </Badge>
          </div>
        </div>
        {mobile && (
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Live Stats
          </h3>
          <Button variant="ghost" size="icon" onClick={fetchAllData} disabled={loading} className="h-6 w-6 text-gray-500 hover:text-blue-600">
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">Total Products:</span>
            <div className="flex items-center gap-2">
              {loading ? (
                <div className="h-2 w-8 bg-gray-200 rounded-full animate-pulse" />
              ) : (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {productsCount}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">Out of Stock:</span>
            <div className="flex items-center gap-2">
              {loading ? (
                <div className="h-2 w-8 bg-gray-200 rounded-full animate-pulse" />
              ) : (
                <Badge variant="outline" className={`${outOfStockCount > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                  {outOfStockCount}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">Active Banners:</span>
            <div className="flex items-center gap-2">
              {loading ? (
                <div className="h-2 w-8 bg-gray-200 rounded-full animate-pulse" />
              ) : (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {bannersCount}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">Pending Orders:</span>
            <div className="flex items-center gap-2">
              {loading ? (
                <div className="h-2 w-8 bg-gray-200 rounded-full animate-pulse" />
              ) : (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {ordersCount.pending}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">Last Updated:</span>
            <span className="text-gray-500 text-xs">{formatTime(lastUpdated)}</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {updatedMenuItems.map((item, index) => (
          <NavItem
            key={item.name}
            item={item}
            index={index}
            isActive={item.subItems ? isSubItemActive(item.subItems) : isActive(item.href)}
            hasSubItems={!!item.subItems}
            expandedItems={expandedItems}
            toggleExpanded={toggleExpanded}
            mobile={mobile}
            setOpen={setOpen}
          />
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 border">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.9, duration: 0.3 }}>
            <Avatar className="h-9 w-9 border-2 border-blue-200">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@allmart.com</p>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600 transition-colors" onClick={onLogout} title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const ResizableSidebar = ({ children, width, onWidthChange }: { children: React.ReactNode; width: number; onWidthChange: (width: number) => void }) => {
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    setIsResizing(true);
    mouseDownEvent.preventDefault();
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing && sidebarRef.current) {
      const newWidth = mouseMoveEvent.clientX;
      const minWidth = 240;
      const maxWidth = 480;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        onWidthChange(newWidth);
      }
    }
  }, [isResizing, onWidthChange]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div ref={sidebarRef} className="relative flex h-screen" style={{ width: `${width}px` }}>
      {children}
      <div className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize flex items-center justify-center group z-10" onMouseDown={startResizing}>
        <div className="w-1 h-16 bg-gray-300 rounded-full group-hover:bg-blue-500 transition-colors duration-200" />
        <GripVertical className="absolute w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
      </div>
      {isResizing && <div className="fixed inset-0 z-50 cursor-col-resize" />}
    </div>
  );
};

export default function Sidebar({ onLogout }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg border">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80 border-r-0 h-screen">
          <NavContent mobile={true} setOpen={setOpen} onLogout={onLogout} />
        </SheetContent>
      </Sheet>

      <div className="hidden lg:block">
        <ResizableSidebar width={sidebarWidth} onWidthChange={setSidebarWidth}>
          <div className="flex flex-col h-screen border-r bg-white shadow-xl">
            <NavContent setOpen={setOpen} width={sidebarWidth} onLogout={onLogout} />
          </div>
        </ResizableSidebar>
      </div>
    </>
  );
}