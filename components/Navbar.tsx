"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import Logo from "../assets/Logo.png";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { GoogleTranslate } from "./GoogleTranslate";

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: string;
    images: string[];
    stock: number;
    category: string;
  };
  quantity: number;
  selectedColor: string;
  selectedColorName: string;
  addedAt: string;
}

const Navbar = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    const timer = setTimeout(() => setLoading(false), 1000);

    const loadCartItems = () => {
      try {
        const savedCart = localStorage.getItem('allmart-cart');
        if (savedCart) {
          const cartItems: CartItem[] = JSON.parse(savedCart);
          const totalItems = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
          setCartItemsCount(totalItems);
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
      }
    };

    loadCartItems();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const categories = [
    { name: "Home", href: "/" },
    { name: "Electronics", href: "/electronics" },
    { name: "Fashion", href: "/fashion" },
    { name: "Jewelry", href: "/jewelry" },
    { name: "Our Developers", href: "/developers" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const searchQuery = searchTerm.trim().toLowerCase().replace(/\s+/g, '-');
      router.push(`/products/${searchQuery}`);
      setSearchTerm("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  if (loading) {
    return (
      <nav className="z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-5 w-32" />
            </div>

            <div className="hidden md:flex items-center gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-[300px] rounded-xl hidden md:block" />
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>

          <div className="flex pb-3 md:hidden">
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        "z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-[#1488CC] to-[#2B32B2] rounded-lg flex items-center justify-center shadow-md">
              <Image
                src={Logo}
                alt="AllMart Avenue Logo"
                width={28}
                height={28}
                className="rounded-md"
              />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block bg-gradient-to-r from-[#1488CC] to-[#2B32B2] bg-clip-text text-transparent">
              AllMart Avenue
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {categories.map((category) => {
              const isActive = isActiveLink(category.href);
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className={cn(
                    "text-sm font-medium relative flex items-center gap-1 transition-all group",
                    isActive
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-[#1488CC] to-[#2B32B2]"
                      : "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#1488CC] hover:to-[#2B32B2]"
                  )}
                >
                  {category.name}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#1488CC] to-[#2B32B2] transition-all",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-[300px] pl-9 pr-4 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </form>

            <Link href={'/cart'}>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gradient-to-r hover:from-[#1488CC]/10 hover:to-[#2B32B2]/10"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs text-white flex items-center justify-center bg-gradient-to-r from-[#1488CC] to-[#2B32B2] shadow-md">
                    {cartItemsCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>

            <div>
              <GoogleTranslate />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col gap-6 py-6 p-2">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-bold"
                  >
                    <div className="h-8 w-8 bg-gradient-to-r from-[#1488CC] to-[#2B32B2] rounded-lg flex items-center justify-center shadow-md">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-[#1488CC] to-[#2B32B2] bg-clip-text text-transparent">
                      AllMart Avenue
                    </span>
                  </Link>

                  <form onSubmit={handleSearch} className="flex items-center relative">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="w-full pl-9 pr-4 rounded-xl"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </form>

                  <div className="flex flex-col gap-4">
                    {categories.map((category) => {
                      const isActive = isActiveLink(category.href);
                      return (
                        <Link
                          key={category.name}
                          href={category.href}
                          className={cn(
                            "text-sm font-medium flex items-center gap-2 transition-all",
                            isActive
                              ? "text-transparent bg-clip-text bg-gradient-to-r from-[#1488CC] to-[#2B32B2]"
                              : "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#1488CC] hover:to-[#2B32B2]"
                          )}
                        >
                          {category.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex pb-3 md:hidden">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-9 pr-4 rounded-xl shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;