"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "../assets/Logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState(3);
  const pathname = usePathname();

  const categories = [
    { name: "Home", href: "/" },
    { name: "Electronics", href: "/electronics" },
    { name: "Fashion", href: "/fashion" },
    { name: "Jewelry", href: "/jewelry" },
    { name: "Premium", href: "/premium" },
    { name: "Our Developers", href: "/developers", icon: Code2 },
  ];

  // Function to check if a link is active
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Mobile Search Panel */}
      <div
        className={cn(
          "absolute top-full left-0 right-0 bg-white border-b shadow-lg transition-all duration-300 overflow-hidden",
          isSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-9 pr-12"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Main navigation */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo and mobile menu */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 py-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-bold"
                  >
                    <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span>AllMart Avenue</span>
                  </Link>
                  <div className="flex flex-col gap-4">
                    {categories.map((category) => {
                      const isActive = isActiveLink(category.href);
                      const IconComponent = category.icon;
                      return (
                        <Link
                          key={category.name}
                          href={category.href}
                          className={cn(
                            "text-sm font-medium transition-colors group flex items-center",
                            isActive
                              ? "text-[#007873]"
                              : "hover:text-[#007873]"
                          )}
                        >
                          <span
                            className={cn(
                              "w-2 h-2 bg-[#007873] rounded-full transition-opacity mr-2",
                              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}
                          ></span>
                          {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                          {category.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-[#007873] rounded-md flex items-center justify-center">
                <Image
                  src={Logo}
                  alt="AllMart Avenue Logo"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">
                AllMart Avenue
              </span>
            </Link>
          </div>

          {/* Desktop categories */}
          <div className="hidden md:flex items-center gap-6">
            {categories.map((category) => {
              const isActive = isActiveLink(category.href);
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative group flex items-center gap-1",
                    isActive
                      ? "text-[#007873]"
                      : "hover:text-[#007873]"
                  )}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  {category.name}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-[#007873] transition-all",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Search bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-9"
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {cartItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <X className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;