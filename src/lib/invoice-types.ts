export interface InvoiceItem {
  description: string
  quantity: number
  price: number
}

export interface InvoiceContact {
  name: string
  email: string
  phone: string
  address: string
}

export interface InvoicePayment {
  bank: string
  accountNumber: string
  accountName: string
}

export interface Invoice {
  number: string
  date: string
  dueDate: string
  from: InvoiceContact
  to: InvoiceContact
  items: InvoiceItem[]
  payment: InvoicePayment
  notes: string
}

export const defaultInvoice: Invoice = {
  number: `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-001`,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  from: {
    name: "",
    email: "",
    phone: "",
    address: ""
  },
  to: {
    name: "",
    email: "",
    phone: "",
    address: ""
  },
  items: [
    {
      description: "",
      quantity: 1,
      price: 0
    }
  ],
  payment: {
    bank: "",
    accountNumber: "",
    accountName: ""
  },
  notes: ""
}

export const dummyInvoice: Invoice = {
  number: 'INV-2023-001',
  date: new Date().toISOString().substr(0, 10),
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
  from: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+62 8123456789',
    address: 'Jl. Merdeka No. 123, Jakarta Selatan, DKI Jakarta 12345'
  },
  to: {
    name: 'PT Abadi Jaya',
    email: 'finance@abadijaya.com',
    phone: '+62 2198765432',
    address: 'Jl. Sudirman No. 45, Jakarta Pusat, DKI Jakarta 10220'
  },
  items: [
    { description: 'Website Development', quantity: 1, price: 5000000 },
    { description: 'Logo Design', quantity: 1, price: 1500000 },
    { description: 'SEO Setup', quantity: 1, price: 2000000 }
  ],
  payment: {
    bank: 'Bank Mandiri',
    accountNumber: '123-456-789-0',
    accountName: 'John Doe'
  },
  notes: 'Pembayaran paling lambat 14 hari setelah faktur diterima. Terima kasih atas kerjasamanya.'
}
