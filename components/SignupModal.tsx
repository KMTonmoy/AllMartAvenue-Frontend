"use client";

import { useState, useRef, useCallback, useContext } from "react";
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
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Upload,
  X,
  RotateCw,
  RotateCcw,
  Check,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { imageUpload } from "@/utils/imageUpload";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./canvasPreview";
import { AuthContext } from "@/Provider/AuthProvider";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoogleSignIn: () => void;
  onOpenLogin: () => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function SignupModal({
  open,
  onOpenChange,
  onGoogleSignIn,
  onOpenLogin,
}: SignupModalProps) {
  const auth = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setIsEditing(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const rotateImage = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  const handleCropComplete = useCallback((crop: PixelCrop) => {
    setCompletedCrop(crop);
  }, []);

  const handleCropImage = useCallback(async () => {
    if (imgRef.current && previewCanvasRef.current && completedCrop) {
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        rotation
      );

      const dataUrl = previewCanvasRef.current.toDataURL("image/jpeg");
      setPhotoPreview(dataUrl);

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

      setIsUploading(true);
      try {
        const imageUrl = await imageUpload(file);
        setPhoto(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
        setIsEditing(false);
        setRotation(0);
        setCrop(undefined);
        setCompletedCrop(undefined);
      }
    }
  }, [completedCrop, rotation]);

  const removePhoto = () => {
    setPhoto("");
    setPhotoPreview("");
    setImgSrc("");
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setImgSrc("");
    setRotation(0);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (auth?.createUser) {
        await auth.createUser(email, password, name, photo);
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white to-blue-50 border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#1488CC] to-[#2B32B2] bg-clip-text text-transparent">
            Create Account
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Join us and start your shopping journey
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Edit Your Photo</h3>
              <p className="text-sm text-gray-600">
                Crop and rotate your image
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              {!!imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={handleCropComplete}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      maxHeight: "70vh",
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => rotateImage(-90)}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Rotate Left
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => rotateImage(90)}
                >
                  <RotateCw className="h-4 w-4 mr-1" />
                  Rotate Right
                </Button>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCropImage}
                  disabled={!completedCrop}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Apply Changes
                </Button>
              </div>
            </div>

            {completedCrop && (
              <div className="hidden">
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    display: "none",
                    objectFit: "contain",
                    width: completedCrop.width,
                    height: completedCrop.height,
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Profile Photo</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {photoPreview || photo ? (
                    <div className="relative">
                      <img
                        src={photoPreview || photo}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Photo
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or GIF. Max 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Full Name
              </Label>
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
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
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
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
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
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:from-[#2B32B2] cursor-pointer hover:to-[#1488CC] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Create Account"}
            </Button>
          </form>
        )}

        {!isEditing && (
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}