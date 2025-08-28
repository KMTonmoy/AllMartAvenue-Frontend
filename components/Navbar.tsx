"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, Sparkles } from "lucide-react";
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
  const [cartItems] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  return (
    <nav
      className={cn(
        // "sticky top-0 z-50 w-full border-b transition-all duration-300",
        "z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
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

          {/* Center: Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {categories.map((category) => {
              const isActive = isActiveLink(category.href);
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className={cn(
                    "text-sm font-medium relative flex items-center gap-1 transition-all",
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

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Search */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-[300px] pl-9 pr-4 rounded-xl"
              />
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gradient-to-r hover:from-[#1488CC]/10 hover:to-[#2B32B2]/10"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs text-white flex items-center justify-center bg-gradient-to-r from-[#1488CC] to-[#2B32B2] shadow-md">
                  {cartItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>

            {/* User */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShoppingCart className="h-4 w-4 mr-2" /> Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <X className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                {/* <div className="flex flex-col gap-6 py-6 p-2">
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
                  <div className="flex flex-col gap-4">
                    {categories.map((category) => {
                      const isActive = isActiveLink(category.href);
                      const IconComponent = category.icon;
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
                          {IconComponent && (
                            <IconComponent className="h-4 w-4 opacity-70" />
                          )}
                          {category.name}
                        </Link>
                      );
                    })}
                  </div>
                </div> */}

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

        {/* Mobile Search (Bottom full width) */}
        <div className="flex pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-9 pr-4 rounded-xl shadow-sm"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
