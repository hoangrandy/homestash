'use client';

import { useState, useTransition } from 'react';
import { deleteItem, updateItem, uploadImage } from '@/app/actions';

type Item = {
  id: string;
  category: string | null;
  name: string;
  description: string | null;
  sku: string | null;
  imageUrl: string | null;
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 800;
          
          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          startTransition(async () => {
            try {
              await updateItem(product.id, { imageUrl: dataUrl });
            } catch (err: any) {
              alert('Upload failed: ' + err.message);
            }
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
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
        style={{ cursor: isEditing ? 'default' : 'pointer', position: 'relative' }}
        title={isEditing ? '' : 'Click to change location'}
      >
        {isEditing ? (
          <input className="edit-input" value={editSku} onChange={e => setEditSku(e.target.value)} placeholder="Location..." />
        ) : isLocationDropdownOpen ? (
          <div
            className="inline-location-dropdown"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsLocationDropdownOpen(false);
              }
            }}
            tabIndex={-1}
          >
            <div className="inline-location-current">{product.sku || 'No location'}</div>
            {allLocations.map(loc => (
              <div
                key={loc}
                className={`inline-location-option ${loc === product.sku ? 'active' : ''}`}
                onMouseDown={() => {
                  setIsLocationDropdownOpen(false);
                  if (loc !== product.sku) {
                    startTransition(async () => {
                      await updateItem(product.id, { sku: loc || null });
                    });
                  }
                }}
              >
                {loc}
              </div>
            ))}
          </div>
        ) : (
          product.sku || '-'
        )}
      </td>
      <td className="table-cell">
        {product.imageUrl ? (
          <a href={product.imageUrl} target="_blank" rel="noreferrer" className="btn-link" style={{ textDecoration: 'none', color: '#0070f3' }}>Photo</a>
        ) : (
          <label style={{ cursor: 'pointer', color: '#0070f3' }} className="btn-link">
            {isPending ? '...' : 'Upload'}
            <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhotoUpload} disabled={isPending} />
          </label>
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
