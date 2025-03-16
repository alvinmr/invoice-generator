import { useState, useEffect } from 'react';
import { Invoice } from './invoice-types';

export interface StoredInvoice {
  id: string;
  invoice: Invoice;
  createdAt: string;
  updatedAt: string;
}

export function useInvoiceStorage() {
  const [storedInvoices, setStoredInvoices] = useState<StoredInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load invoices from localStorage when component mounts
  useEffect(() => {
    const loadInvoices = () => {
      try {
        const savedInvoices = localStorage.getItem('invoices');
        if (savedInvoices) {
          setStoredInvoices(JSON.parse(savedInvoices));
        }
      } catch (error) {
        console.error('Error loading invoices from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, []);

  // Save an invoice
  const saveInvoice = (invoice: Invoice) => {
    try {
      // Check if this invoice already exists (by number)
      const now = new Date().toISOString();
      const existingIndex = storedInvoices.findIndex(item => item.invoice.number === invoice.number);
      
      let updatedInvoices: StoredInvoice[];
      
      if (existingIndex >= 0) {
        // Update existing invoice
        updatedInvoices = [...storedInvoices];
        updatedInvoices[existingIndex] = {
          ...updatedInvoices[existingIndex],
          invoice,
          updatedAt: now
        };
      } else {
        // Add new invoice
        const newStoredInvoice: StoredInvoice = {
          id: generateId(),
          invoice,
          createdAt: now,
          updatedAt: now
        };
        updatedInvoices = [...storedInvoices, newStoredInvoice];
      }
      
      // Save to localStorage
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
      setStoredInvoices(updatedInvoices);
      
      return true;
    } catch (error) {
      console.error('Error saving invoice:', error);
      return false;
    }
  };
  
  // Get invoice by ID
  const getInvoice = (id: string): StoredInvoice | undefined => {
    return storedInvoices.find(item => item.id === id);
  };
  
  // Delete invoice by ID
  const deleteInvoice = (id: string): boolean => {
    try {
      const updatedInvoices = storedInvoices.filter(item => item.id !== id);
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
      setStoredInvoices(updatedInvoices);
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      return false;
    }
  };

  // Generate a simple ID
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  };

  return {
    invoices: storedInvoices,
    isLoading,
    saveInvoice,
    getInvoice,
    deleteInvoice
  };
}
