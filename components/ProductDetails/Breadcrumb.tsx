'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface BreadcrumbProps {
  productName?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ productName }) => {
  const pathname = usePathname();

  // Generate breadcrumb items from URL path
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(path => path);

    const breadcrumbs = paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const name = decodeURIComponent(path).replace(/-/g, ' ');

      // Capitalize first letter of each word
      const formattedName = name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        href,
        name: formattedName,
        isLast: index === paths.length - 1
      };
    });

    // Add home as first breadcrumb
    return [
      { href: '/', name: 'Home', isLast: false },
      ...breadcrumbs
    ];
  };

  const breadcrumbs = generateBreadcrumbs();

  // If productName is provided, replace the last breadcrumb with it
  if (productName && breadcrumbs.length > 0) {
    breadcrumbs[breadcrumbs.length - 1].name = productName;
  }

  return (
    <nav className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center space-x-2">
            {index > 0 && <span>/</span>}
            {breadcrumb.isLast ? (
              <span className="text-gray-900 font-medium">
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="hover:text-gray-900 cursor-pointer transition-colors"
              >
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;