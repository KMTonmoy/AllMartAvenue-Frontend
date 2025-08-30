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
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../assets/Logo.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <motion.footer
      className="bg-gray-900 text-white mt-auto"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false }}
    >
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-[#1488CC] to-[#2B32B2] py-8">
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
              <div className="h-10 w-10 bg-gradient-to-br from-[#1488CC] to-[#2B32B2] rounded-md flex items-center justify-center">
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
              <a href="#" className="text-gray-300 hover:text-[#1488CC] transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#1488CC] transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#1488CC] transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#1488CC] transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-[#1488CC]">Home</Link></li>
              <li><Link href="/electronics" className="text-gray-300 hover:text-[#1488CC]">Electronics</Link></li>
              <li><Link href="/fashion" className="text-gray-300 hover:text-[#1488CC]">Fashion</Link></li>
              <li><Link href="/jewelry" className="text-gray-300 hover:text-[#1488CC]">Jewelry</Link></li>
              <li><Link href="/premium" className="text-gray-300 hover:text-[#1488CC]">Premium</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-[#1488CC]">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#1488CC]">Returns</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#1488CC]">Shipping</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#1488CC]">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#1488CC]">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-[#1488CC]" />
                <span>support@allmartavenue.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-[#1488CC]" />
                <span>+880 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-[#1488CC]" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} AllMart Avenue. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
