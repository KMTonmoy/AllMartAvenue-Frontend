"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const LocalPayment: React.FC = () => {
  const paymentMethods = [
    {
      id: 1,
      name: "bKash",
      logo: "https://downloadr2.apkmirror.com/wp-content/uploads/2020/03/5e6ab3fa58a91.png",
    },
    {
      id: 2,
      name: "Nagad",
      logo: "https://play-lh.googleusercontent.com/9ps_d6nGKQzfbsJfMaFR0RkdwzEdbZV53ReYCS09Eo5MV-GtVylFD-7IHcVktlnz9Mo",
    },
    {
      id: 3,
      name: "Rocket",
      logo: "https://images.seeklogo.com/logo-png/31/1/dutch-bangla-rocket-logo-png_seeklogo-317692.png",
    },
    {
      id: 4,
      name: "Visa Card",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsNgW6FaeEe3QP2NMKcry5tSEINxi2Slv8og&s",
    },
    {
      id: 5,
      name: "Bank Transfer",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBLbfVr2TQLguSyT_6r3XFx8kbLBZeIW0SEg&s",
    },
    {
      id: 6,
      name: "Cash on Delivery",
      logo: "https://miro.medium.com/1*5c8KOrF2CKKQCcY67sJDWA.jpeg",
    },
  ];

  return (
    <section className="py-16  ">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Payment Methods
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We support a wide range of secure payment options for your
            convenience. Choose the method that works best for you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex flex-col items-center">
              <Card className="w-full aspect-square flex items-center justify-center p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-2 border-transparent hover:border-blue-100 bg-white/70 backdrop-blur-sm">
                <CardContent className="flex items-center justify-center p-0 w-full h-full">
                  <Image
                    src={method.logo}
                    alt={method.name}
                    width={80}
                    height={80}
                    className="object-contain h-full w-full transition-transform duration-300 group-hover:scale-110"
                  />
                </CardContent>
              </Card>
              <span className="mt-4 text-sm font-medium text-gray-700 text-center">
                {method.name}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-center mb-6 text-gray-800">
            Secure & Convenient Payments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">
                Secure Transactions
              </h4>
              <p className="text-gray-600 text-sm">
                All payments are encrypted and secure
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">
                Instant Confirmation
              </h4>
              <p className="text-gray-600 text-sm">
                Get immediate payment confirmation
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">
                Multiple Options
              </h4>
              <p className="text-gray-600 text-sm">
                Choose from various payment methods
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalPayment;