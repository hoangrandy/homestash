'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';
import ItemForm from './ProductForm';
import ItemTable from './ProductTable';

type Item = {
  id: string;
  category: string | null;
  name: string;
  description: string | null;
  sku: string | null;
};

export default function InventoryManager({ products }: { products: Item[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isPending, startTransition] = useTransition();

  // Debouncing search updates the URL
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        if (searchTerm) {
          router.push(`/?q=${encodeURIComponent(searchTerm)}`);
        } else {
          router.push('/');
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, router]);

  return (
    <div className="inventory-dashboard">
      <header className="dashboard-header">
        <h1>Home Stash</h1>
        <p>Track and manage everything stored in your home — all in one place.</p>
      </header>
      
      <div className="dashboard-grid">
        <div className="dashboard-sidebar">
          <ItemForm />
        </div>
        
        <div className="dashboard-main">
          <div className="search-bar-container">
            <input 
              type="text" 
              placeholder="Search by name or Location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {isPending && <span className="loading-indicator">Searching...</span>}
          </div>
          
          <ItemTable products={products} />
        </div>
      </div>
    </div>
  );
}
