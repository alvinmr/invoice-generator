import { Invoice } from '@/lib/invoice-types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Card } from './ui/card'

interface InvoicePreviewProps {
  invoice: Invoice
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const calculateTotal = () => {
    return invoice.items.reduce((total, item) => {
      return total + (item.quantity * item.price)
    }, 0)
  }

  return (
    <Card className="p-6 bg-white print:shadow-none" id="invoice-preview">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">FAKTUR</h1>
          <p className="text-muted-foreground">Nomor: {invoice.number}</p>
        </div>
        <div className="text-right">
          <p><strong>Tanggal: </strong>{formatDate(invoice.date)}</p>
          <p><strong>Jatuh Tempo: </strong>{formatDate(invoice.dueDate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-8">
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">DARI</h3>
          <p className="font-semibold">{invoice.from.name}</p>
          <p>{invoice.from.email}</p>
          <p>{invoice.from.phone}</p>
          <p className="whitespace-pre-line">{invoice.from.address}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">UNTUK</h3>
          <p className="font-semibold">{invoice.to.name}</p>
          <p>{invoice.to.email}</p>
          <p>{invoice.to.phone}</p>
          <p className="whitespace-pre-line">{invoice.to.address}</p>
        </div>
      </div>

      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Deskripsi</th>
              <th className="py-2 text-right">Jumlah</th>
              <th className="py-2 text-right">Harga</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.description}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                <td className="py-2 text-right">{formatCurrency(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right py-2"><strong>Subtotal</strong></td>
              <td className="text-right py-2">{formatCurrency(calculateTotal())}</td>
            </tr>
            <tr className="border-t-2 border-foreground">
              <td colSpan={3} className="text-right py-2"><strong>TOTAL</strong></td>
              <td className="text-right py-2 font-bold">{formatCurrency(calculateTotal())}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-8 border border-border rounded-md p-4">
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
          <p>{invoice.notes}</p>
        </div>
      )}

      <div className="mt-8 text-center text-muted-foreground">
        <p>Terima kasih atas kepercayaan Anda!</p>
      </div>
    </Card>
  )
}
