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
  imageUrl: string | null;
};

export default function InventoryManager({ products, categories, locations }: { products: Item[], categories: string[], locations: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);

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
          {!isFormOpen ? (
            <button 
              onClick={() => setIsFormOpen(true)} 
              className="btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}
            >
              + Add New Item
            </button>
          ) : (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsFormOpen(false)} 
                style={{ marginBottom: '1rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center' }}
              >
                ← Close Form
              </button>
              <ItemForm categories={categories} locations={locations} />
            </div>
          )}
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
