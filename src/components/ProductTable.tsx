import ItemTableRow from './ProductTableRow';

type Item = {
  id: string;
  category: string | null;
  name: string;
  description: string | null;
  sku: string | null;
  imageUrl: string | null;
};

export default function ItemTable({ products }: { products: Item[] }) {
  const allLocations = Array.from(new Set(products.map(p => p.sku).filter(Boolean))) as string[];
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No items found. Start by adding a new item!</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th className="table-header">Category</th>
            <th className="table-header">Name</th>
            <th className="table-header">Description</th>
            <th className="table-header">Location</th>
            <th className="table-header">Photo</th>
            <th className="table-header">Edit</th>
            <th className="table-header align-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <ItemTableRow key={product.id} product={product} allLocations={allLocations} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
