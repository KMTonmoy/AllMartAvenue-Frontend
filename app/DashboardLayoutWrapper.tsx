'use client';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardLayoutWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isDashboardPage = pathname?.startsWith('/dashboard');

  if (isDashboardPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}