export interface ProductColor {
  value: string;
  name: string;
}

export interface Product {
  _id: number;
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
  videoURL: string;
  features: string[];
}

export interface ServiceFeature {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  subtext: string;
}