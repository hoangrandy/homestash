import { getItems, getDistinctCategories, getDistinctLocations } from './actions';
import InventoryManager from '@/components/InventoryManager';
import AppContainer from '@/components/AppContainer';

export const metadata = {
  title: 'Home Stash',
  description: 'Track and manage your home inventory with ease.',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const rawQ = resolvedSearchParams.q;
  const q = typeof rawQ === 'string' ? rawQ : undefined;
  
  const [products, categories, locations] = await Promise.all([
    getItems(q),
    getDistinctCategories(),
    getDistinctLocations(),
  ]);

  return (
    <main>
      <AppContainer>
        <InventoryManager products={products} categories={categories} locations={locations} />
      </AppContainer>
    </main>
  );
}
