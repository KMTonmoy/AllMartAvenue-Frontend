import React from 'react';
import { Truck, Shield, RotateCcw } from 'lucide-react';
import { ServiceFeature } from '@/types/product';

const serviceFeatures: ServiceFeature[] = [
  { icon: Shield, text: 'Authentic', subtext: 'Quality guarantee' },
  { icon: RotateCcw, text: 'Easy Returns', subtext: 'Within 7 days' }
];

const ServiceFeatures: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 pt-6 border-t border-gray-200">
      {serviceFeatures.map((feature, index) => (
        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <feature.icon className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{feature.text}</p>
            <p className="text-xs text-gray-500">{feature.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceFeatures;