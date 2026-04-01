'use client';

import { useState, useTransition } from 'react';
import { deleteItem, updateItem } from '@/app/actions';

type Item = {
  id: string;
  category: string | null;
  name: string;
  description: string | null;
  sku: string | null;
};

export default function ItemTableRow({ product, allLocations }: { product: Item, allLocations: string[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [editSku, setEditSku] = useState(product.sku || '');
  const [editCategory, setEditCategory] = useState(product.category || '');
  const [editName, setEditName] = useState(product.name);
  const [editDescription, setEditDescription] = useState(product.description || '');
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    startTransition(async () => {
      try {
        await updateItem(product.id, {
          category: editCategory || null,
          name: editName,
          description: editDescription || null,
          sku: editSku || null,
        });
        setIsEditing(false);
      } catch (e: any) {
        alert(e.message);
      }
    });
  };

  const handleCancel = () => {
    setEditCategory(product.category || '');
    setEditName(product.name);
    setEditDescription(product.description || '');
    setEditSku(product.sku || '');
    setIsLocationDropdownOpen(false);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      startTransition(async () => {
        await deleteItem(product.id);
      });
    }
  };

  return (
    <tr className={isPending ? "table-row pending" : "table-row"}>
      <td className="table-cell secondary-cell">
        {isEditing ? (
          <input className="edit-input" value={editCategory} onChange={e => setEditCategory(e.target.value)} placeholder="Category..." />
        ) : (
          product.category || '-'
        )}
      </td>
      <td className="table-cell main-cell">
        {isEditing ? (
          <input className="edit-input" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name..." required />
        ) : (
          product.name
        )}
      </td>
      <td className="table-cell secondary-cell" title={isEditing ? '' : (product.description || '')}>
        {isEditing ? (
          <input className="edit-input" value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="Description..." />
        ) : (
          product.description ? (product.description.length > 60 ? product.description.slice(0, 60) + '…' : product.description) : '-'
        )}
      </td>
      <td 
        className="table-cell secondary-cell" 
        onClick={() => {
          if (!isEditing) setIsLocationDropdownOpen(true);
        }}
        style={{ cursor: isEditing ? 'default' : 'pointer' }}
        title="Click to select another location"
      >
        {isEditing ? (
          <input className="edit-input" value={editSku} onChange={e => setEditSku(e.target.value)} placeholder="Location..." />
        ) : isLocationDropdownOpen ? (
          <select 
            autoFocus
            className="edit-input"
            onBlur={() => setIsLocationDropdownOpen(false)}
            onChange={(e) => {
               const newLocation = e.target.value;
               setIsLocationDropdownOpen(false);
               if (newLocation !== product.sku) {
                 startTransition(async () => {
                   await updateItem(product.id, { sku: newLocation || null });
                 });
               }
            }}
            defaultValue={product.sku || ""}
          >
            <option value="" disabled>Select location...</option>
            {allLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        ) : (
          product.sku || '-'
        )}
      </td>
      <td className="table-cell">
        {isEditing ? (
          <div className="edit-actions" style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleUpdate} disabled={isPending} className="btn-small success">Save</button>
            <button onClick={handleCancel} disabled={isPending} className="btn-small neutral">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn-link edit-link">Edit</button>
        )}
      </td>
      <td className="table-cell align-right">
        <button onClick={handleDelete} disabled={isPending} className="btn-link delete-link">
          Delete
        </button>
      </td>
    </tr>
  );
}
