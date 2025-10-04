'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
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
  Plus,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  Sparkles,
  Clock,
  GripVertical,
} from 'lucide-react';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    badge: null,
  },
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: Package,
    badge: 12,
    subItems: [
      {
        name: 'All Products',
        href: '/dashboard/products',
        icon: Package,
        badge: 45
      },
      {
        name: 'Add Product',
        href: '/dashboard/products/add',
        icon: Plus,
        badge: null
      },
      {
        name: 'Out of Stock',
        href: '/dashboard/products/out-of-stock',
        icon: AlertTriangle,
        badge: 3
      },
    ],
  },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingCart,
    badge: 8,
    subItems: [
      {
        name: 'All Orders',
        href: '/dashboard/orders',
        icon: ShoppingCart,
        badge: 23
      },
      {
        name: 'Pending Orders',
        href: '/dashboard/orders/pending',
        icon: Clock,
        badge: 8
      },
      {
        name: 'Delivered Orders',
        href: '/dashboard/orders/delivered',
        icon: CheckCircle,
        badge: 15
      },
    ],
  },
  {
    name: 'Banners',
    href: '/dashboard/banners',
    icon: Image,
    badge: 5,
  },
];

const sidebarVariants = {
  hidden: { x: -300, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const subItemVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" }
};

interface NavItemProps {
  item: any;
  index: number;
  isActive: boolean;
  hasSubItems: boolean;
  expandedItems: string[];
  toggleExpanded: (name: string) => void;
  mobile: boolean;
  setOpen: (open: boolean) => void;
}

const NavItem = ({ item, index, isActive, hasSubItems, expandedItems, toggleExpanded, mobile, setOpen }: NavItemProps) => {
  const Icon = item.icon;
  const pathname = usePathname();

  if (hasSubItems) {
    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 + index * 0.1 }}
      >
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className="w-full justify-between group relative overflow-hidden"
          onClick={() => toggleExpanded(item.name)}
        >
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-blue-100 rounded-md"
              layoutId="activeBackground"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}

          <div className="flex items-center space-x-3 z-10 relative">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
            <span className="font-medium">{item.name}</span>
          </div>

          <div className="flex items-center space-x-2 z-10 relative">
            {item.badge && (
              <Badge variant="default" className="h-5 px-1 text-xs bg-red-500">
                {item.badge}
              </Badge>
            )}
            <motion.div
              animate={{ rotate: expandedItems.includes(item.name) ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </div>
        </Button>

        <AnimatePresence>
          {expandedItems.includes(item.name) && (
            <motion.div
              variants={subItemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-3"
            >
              {item.subItems.map((subItem: any, subIndex: number) => {
                const SubIcon = subItem.icon;
                const isSubActive = pathname === subItem.href;

                return (
                  <motion.div
                    key={subItem.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: subIndex * 0.05 }}
                  >
                    <Link
                      href={subItem.href}
                      onClick={() => mobile && setOpen(false)}
                    >
                      <Button
                        variant={isSubActive ? "secondary" : "ghost"}
                        className="w-full justify-start text-sm group relative"
                      >
                        {isSubActive && (
                          <motion.div
                            className="absolute inset-0 bg-blue-50 rounded-md"
                            layoutId="activeSubBackground"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        <div className="flex items-center space-x-2 z-10 relative">
                          <SubIcon className="h-3 w-3" />
                          <span>{subItem.name}</span>
                        </div>
                        {subItem.badge && (
                          <Badge variant="outline" className="h-4 px-1 text-xs ml-auto z-10">
                            {subItem.badge}
                          </Badge>
                        )}
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
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.1 + index * 0.1 }}
    >
      <Link
        href={item.href}
        onClick={() => mobile && setOpen(false)}
      >
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className="w-full justify-start group relative overflow-hidden"
        >
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-blue-100 rounded-md"
              layoutId="activeBackground"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}

          <div className="flex items-center space-x-3 z-10 relative">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
            <span className="font-medium">{item.name}</span>
          </div>

          {item.badge && (
            <Badge variant="default" className="h-5 px-1 text-xs bg-red-500 ml-auto z-10">
              {item.badge}
            </Badge>
          )}
        </Button>
      </Link>
    </motion.div>
  );
};

const NavContent = ({ mobile = false, setOpen, width = 320 }: { mobile?: boolean; setOpen: (open: boolean) => void; width?: number }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Products']);
  const pathname = usePathname();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isSubItemActive = (subItems: any[]) => subItems.some((subItem: any) => pathname === subItem.href);

  return (
    <motion.div
      className={`flex flex-col h-screen ${mobile ? '' : 'fixed left-0 top-0'}`}
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      style={!mobile ? { width: `${width}px` } : {}}
    >
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center space-x-3">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
          >
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <motion.div
        className="p-4 bg-gradient-to-r from-green-50 to-blue-50 mx-4 mt-4 rounded-lg border"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">Today's Revenue</p>
            <p className="text-lg font-bold text-gray-900">$2,847</p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: 1 }}
          >
            <TrendingUp className="h-6 w-6 text-green-500" />
          </motion.div>
        </div>
      </motion.div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => (
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
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9 }}
          >
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
          <Button variant="ghost" size="icon" className="text-gray-500">
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

  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    setIsResizing(true);
    mouseDownEvent.preventDefault();
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (mouseMoveEvent: MouseEvent) => {
    if (isResizing && sidebarRef.current) {
      const newWidth = mouseMoveEvent.clientX;
      const minWidth = 240;
      const maxWidth = 480;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        onWidthChange(newWidth);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  return (
    <div
      ref={sidebarRef}
      className="relative flex h-screen"
      style={{ width: `${width}px` }}
    >
      {children}
      <div
        className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize flex items-center justify-center group z-10"
        onMouseDown={startResizing}
      >
        <div className="w-1 h-16 bg-gray-300 rounded-full group-hover:bg-blue-500 transition-colors duration-200" />
        <GripVertical className="absolute w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
      </div>
      {isResizing && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
    </div>
  );
};

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg border"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80 border-r-0 h-screen">
          <NavContent mobile={true} setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      <div className="hidden lg:block">
        <ResizableSidebar width={sidebarWidth} onWidthChange={setSidebarWidth}>
          <div className="flex flex-col h-screen border-r bg-white shadow-xl">
            <NavContent setOpen={setOpen} width={sidebarWidth} />
          </div>
        </ResizableSidebar>
      </div>
    </>
  );
}