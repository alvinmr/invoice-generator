import { Invoice } from '@/lib/invoice-types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Card } from './ui/card'
import { useTheme } from 'next-themes'

interface InvoicePreviewProps {
  invoice: Invoice
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  // Remove theme dependency for preview styling - always use light mode style
  
  const calculateSubtotal = () => {
    return invoice.items.reduce((total, item) => {
      return total + (item.quantity * item.price)
    }, 0)
  }
  
  const calculateTax = () => {
    return calculateSubtotal() * (invoice.tax / 100);
  }
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  }

  return (
    <div className="bg-white text-black rounded-lg shadow-lg p-3 sm:p-6 print:shadow-none text-sm sm:text-base">
      {/* Bagian header invoice */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">FAKTUR</h1>
          <p className="text-xs sm:text-sm text-gray-500">Nomor: {invoice.number}</p>
        </div>
        <div className="sm:text-right text-xs sm:text-base">
          <p><strong>Tanggal: </strong>{formatDate(invoice.date)}</p>
          <p><strong>Jatuh Tempo: </strong>{formatDate(invoice.dueDate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-6 sm:mt-8">
        <div>
          <h3 className="font-semibold text-xs sm:text-sm text-gray-500">DARI</h3>
          <p className="font-semibold">{invoice.from.name}</p>
          <p className="text-xs sm:text-sm">{invoice.from.email}</p>
          <p className="text-xs sm:text-sm">{invoice.from.phone}</p>
          {invoice.from.npwp && <p className="text-xs sm:text-sm"><span className="text-gray-500">NPWP:</span> {invoice.from.npwp}</p>}
          <p className="whitespace-pre-line text-xs sm:text-sm">{invoice.from.address}</p>
        </div>
        <div>
          <h3 className="font-semibold text-xs sm:text-sm text-gray-500">UNTUK</h3>
          <p className="font-semibold">{invoice.to.name}</p>
          <p className="text-xs sm:text-sm">{invoice.to.email}</p>
          <p className="text-xs sm:text-sm">{invoice.to.phone}</p>
          {invoice.to.npwp && <p className="text-xs sm:text-sm"><span className="text-gray-500">NPWP:</span> {invoice.to.npwp}</p>}
          <p className="whitespace-pre-line text-xs sm:text-sm">{invoice.to.address}</p>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-left">Deskripsi</th>
              <th className="py-2 text-right w-16">Jumlah</th>
              <th className="py-2 text-right w-24">Harga</th>
              <th className="py-2 text-right w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2">
                  <div className="whitespace-normal break-words">{item.description}</div>
                </td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                <td className="py-2 text-right">{formatCurrency(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right py-2"><strong>Subtotal</strong></td>
              <td className="text-right py-2">{formatCurrency(calculateSubtotal())}</td>
            </tr>
            {invoice.tax > 0 && (
              <tr>
                <td colSpan={3} className="text-right py-2"><strong>Pajak ({invoice.tax}%)</strong></td>
                <td className="text-right py-2">{formatCurrency(calculateTax())}</td>
              </tr>
            )}
            <tr className="border-t-2 border-gray-400">
              <td colSpan={3} className="text-right py-2"><strong>TOTAL</strong></td>
              <td className="text-right py-2 font-bold">{formatCurrency(calculateTotal())}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-8 border border-gray-300 rounded-md p-4">
        <h3 className="font-semibold">Instruksi Pembayaran</h3>
        <div className="flex flex-wrap gap-4 mt-2">
          <p><strong>Bank:</strong> {invoice.payment.bank}</p>
          <p><strong>Rekening:</strong> {invoice.payment.accountNumber}</p>
          <p><strong>A/N:</strong> {invoice.payment.accountName}</p>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-4">
          <h3 className="font-semibold">Catatan</h3>
          <p className="whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}

      <div className="mt-8 text-center text-gray-500">
        <p>Terima kasih atas kepercayaan Anda!</p>
      </div>
    </div>
  )
}
