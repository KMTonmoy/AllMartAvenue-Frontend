"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, Camera } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoogleSignIn: () => void;
  onOpenLogin: () => void;
}

export function SignupModal({ open, onOpenChange, onGoogleSignIn, onOpenLogin }: SignupModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      email: email,
      name: name,
      photo: photo,
      role: "user",
    };
    console.log("Signup with:", userData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white to-blue-50 border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#1488CC] to-[#2B32B2] bg-clip-text text-transparent">
            Create Account
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Join us and start your shopping journey
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="pl-10 border-gray-300 focus:border-[#1488CC] focus:ring-[#1488CC]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10 border-gray-300 focus:border-[#1488CC] focus:ring-[#1488CC]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo" className="text-gray-700">Photo URL (Optional)</Label>
            <div className="relative">
              <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="photo"
                type="url"
                placeholder="Paste your photo URL"
                className="pl-10 border-gray-300 focus:border-[#1488CC] focus:ring-[#1488CC]"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="pl-10 pr-10 border-gray-300 focus:border-[#1488CC] focus:ring-[#1488CC]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-[#1488CC]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:from-[#2B32B2] cursor-pointer hover:to-[#1488CC] transition-all duration-300"
          >
            Create Account
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center gap-2 border-gray-300 hover:border-gray-400 transition-all"
          onClick={onGoogleSignIn}
        >
          <FcGoogle className="h-5 w-5" />
          Sign up with Google
        </Button>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Button 
            variant="link" 
            className="p-0 h-auto bg-gradient-to-r from-[#1488CC] to-[#2B32B2] bg-clip-text text-transparent cursor-pointer hover:from-[#2B32B2] hover:to-[#1488CC]"
            onClick={() => {
              onOpenChange(false);
              onOpenLogin();
            }}
          >
            Sign in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}