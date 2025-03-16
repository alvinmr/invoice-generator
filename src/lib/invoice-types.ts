export interface Person {
  name: string;
  email: string;
  phone: string;
  address: string;
  npwp?: string; // Menambahkan field optional untuk NPWP
}

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
  npwp?: string // Menambahkan field optional untuk NPWP
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
  number: 'INV-2025-0116-001',
  date: new Date().toISOString().substr(0, 10),
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
  from: {
    name: 'Alvin Maulana Rhusuli',
    email: 'maulanaalvin@gmail.com',
    phone: '081234567890',
    address: 'Jl. Raya Kuta No. 123, Kuta, Bali 80361',
    npwp: '00.000.000.0-000.000'
  },
  to: {
    name: 'Bank Indonesia Bali',
    email: '-',
    phone: '-',
    address: 'Jl. Letda Tantular No.4, Dangin Puri Klod, Kec. Denpasar Tim., Kota Denpasar, Bali 80234'
  },
  items: [
    { description: 'Website Development', quantity: 1, price: 5000000 },
  ],
  payment: {
    bank: 'Bank BCA',
    accountNumber: '6955112702 ',
    accountName: 'Alvin Maulana Rhusuli'
  },
  notes: 'Pembayaran paling lambat 14 hari setelah faktur diterima. Terima kasih atas kerjasamanya.'
}
