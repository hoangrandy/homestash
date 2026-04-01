'use client';

import { useState, useRef } from 'react';
import { addItem } from '@/app/actions';

export default function ItemForm() {
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    try {
      await addItem(formData);
      formRef.current?.reset();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="product-form-card">
      <h2>Add New Item</h2>
      <form ref={formRef} action={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input type="text" id="category" name="category" placeholder="Optional Category" />
        </div>
        
        <div className="form-group">
          <label htmlFor="name">Name <span className="required">*</span></label>
          <input type="text" id="name" name="name" required placeholder="Item Name" />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Optional description (up to 200 characters)"
            maxLength={200}
            rows={3}
            className="form-textarea"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="sku">Location</label>
          <input type="text" id="sku" name="sku" placeholder="Optional Location" />
        </div>
        
        <button type="submit" className="btn-primary">Add Item</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
