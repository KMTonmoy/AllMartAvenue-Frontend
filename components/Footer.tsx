"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  Shield,
  Truck,
  Heart
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Newsletter Section */}
      <div className="bg-[#007873] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold">Subscribe to Our Newsletter</h3>
              <p className="mt-2">Get the latest updates on new products and upcoming sales</p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/90 text-gray-900 border-none focus-visible:ring-2 focus-visible:ring-white"
              />
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gradient-to-br from-[#007873] to-teal-800 rounded-md flex items-center justify-center">
                <Image
                  src={Logo}
                  alt="AllMart Avenue Logo"
                  width={36}
                  height={36}
                  className="rounded-md"
                />
              </div>
              <span className="font-bold text-xl">AllMart Avenue</span>
            </Link>
            <p className="text-gray-300">
              Your one-stop destination for all your shopping needs. Quality products at affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#007873] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/electronics" className="text-gray-300 hover:text-[#007873] transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/fashion" className="text-gray-300 hover:text-[#007873] transition-colors">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/jewelry" className="text-gray-300 hover:text-[#007873] transition-colors">
                  Jewelry
                </Link>
              </li>
              <li>
                <Link href="/premium" className="text-gray-300 hover:text-[#007873] transition-colors">
                  Premium
                </Link>
              </li>
              <li>
                <Link href="/developers" className="text-gray-300 hover:text-[#007873] transition-colors">
                  Our Developers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#007873] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-[#007873] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-[#007873] transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-[#007873] transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-[#007873] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-[#007873] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#007873] mt-0.5" />
                <p className="text-gray-300">123 Shopping Avenue, Retail District, Market City, 10001</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#007873]" />
                <p className="text-gray-300">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#007873]" />
                <p className="text-gray-300">support@allmartavenue.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-5 w-5 text-[#007873]" />
                <span>Free Shipping on Orders Over $50</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-5 w-5 text-[#007873]" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-5 w-5 text-[#007873]" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AllMart Avenue. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>by our developers</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-[#007873] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-[#007873] transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-[#007873] transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;