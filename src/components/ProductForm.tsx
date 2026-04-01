'use client';

import { useState, useRef } from 'react';
import { addItem } from '@/app/actions';

interface ComboDropdownProps {
  label: string;
  name: string;
  options: string[];
  placeholder?: string;
}

function ComboDropdown({ label, name, options, placeholder }: ComboDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleSelect = (val: string) => {
    if (val === '__add_new__') {
      setIsAdding(true);
      setSelected('');
      setIsOpen(false);
    } else {
      setSelected(val);
      setIsAdding(false);
      setIsOpen(false);
    }
  };

  const handleCustomConfirm = () => {
    if (customValue.trim()) {
      setSelected(customValue.trim());
      setIsAdding(false);
    }
  };

  const displayValue = selected || '';

  return (
    <div className="form-group">
      <label>{label}</label>

      {/* Hidden input so FormData picks up the final value */}
      <input type="hidden" name={name} value={isAdding ? customValue : selected} />

      {isAdding ? (
        <div className="combo-add-row">
          <input
            type="text"
            autoFocus
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder={`New ${label.toLowerCase()}...`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); handleCustomConfirm(); }
              if (e.key === 'Escape') { setIsAdding(false); setCustomValue(''); }
            }}
          />
          <button type="button" className="combo-confirm-btn" onClick={handleCustomConfirm}>✓</button>
          <button type="button" className="combo-cancel-btn" onClick={() => { setIsAdding(false); setCustomValue(''); }}>✕</button>
        </div>
      ) : (
        <div className="combo-wrapper">
          <button
            type="button"
            className="combo-trigger"
            onClick={() => setIsOpen((o) => !o)}
          >
            <span className={displayValue ? 'combo-value' : 'combo-placeholder'}>
              {displayValue || placeholder || `Select ${label.toLowerCase()}...`}
            </span>
            <span className="combo-arrow">{isOpen ? '▲' : '▼'}</span>
          </button>
          {isOpen && (
            <div className="combo-dropdown">
              {options.length === 0 && (
                <div className="combo-empty">No options yet</div>
              )}
              {options.map((opt) => (
                <div
                  key={opt}
                  className={`combo-option ${selected === opt ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </div>
              ))}
              <div className="combo-option combo-add-option" onClick={() => handleSelect('__add_new__')}>
                ＋ Add new {label.toLowerCase()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ItemFormProps {
  categories: string[];
  locations: string[];
}

export default function ItemForm({ categories, locations }: ItemFormProps) {
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    try {
      await addItem(formData);
      // Re-mount the dropdowns to reset state
      setFormKey((k) => k + 1);
      formRef.current?.reset();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="product-form-card">
      <h2>Add New Item</h2>
      <form key={formKey} ref={formRef} action={handleSubmit} className="product-form">

        <ComboDropdown
          label="Category"
          name="category"
          options={categories}
          placeholder="Optional category..."
        />

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
          />
        </div>

        <ComboDropdown
          label="Location"
          name="sku"
          options={locations}
          placeholder="Optional location..."
        />

        <button type="submit" className="btn-primary">Add Item</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
