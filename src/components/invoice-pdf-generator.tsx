"use client"

import { Invoice } from '@/lib/invoice-types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { jsPDF } from 'jspdf'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'

interface InvoicePDFGeneratorProps {
  invoice: Invoice;
  className?: string;
}

export function InvoicePDFGenerator({ invoice, className }: InvoicePDFGeneratorProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const generatePDF = () => {
    if (!isClient) return

    try {
      // Create new jsPDF instance
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margin = 20
      let y = margin
      
      // --- Header section ---
      doc.setFont("helvetica", "bold")
      doc.setFontSize(20)
      doc.text("FAKTUR", margin, y)
      
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.text(`Nomor: ${invoice.number}`, margin, y + 7)
      
      // Add date information (right aligned)
      const dateText = `Tanggal: ${formatDate(invoice.date)}`
      const dueDateText = `Jatuh Tempo: ${formatDate(invoice.dueDate)}`
      doc.text(dateText, pageWidth - margin - doc.getTextWidth(dateText), y)
      doc.text(dueDateText, pageWidth - margin - doc.getTextWidth(dueDateText), y + 7)
      
      // --- From/To section ---
      y += 25
      doc.setFont("helvetica", "bold")
      doc.text("DARI", margin, y)
      doc.text("UNTUK", pageWidth / 2 + 5, y)
      
      y += 7
      
      // Helper function to handle multiline text with proper line height
      const addMultiLineText = (text: string, x: number, y: number, maxWidth: number): number => {
        if (!text) return y
        
        const lineHeight = 5
        // Split text by newlines first
        const parts = text.split('\n')
        let currentY = y
        
        parts.forEach(part => {
          const lines = doc.splitTextToSize(part, maxWidth)
          doc.text(lines, x, currentY)
          currentY += lines.length * lineHeight
        })
        
        return currentY
      }
      
      // Format From address
      let fromY = y
      doc.setFont("helvetica", "bold")
      doc.text(invoice.from.name || "", margin, fromY)
      fromY += 5
      
      doc.setFont("helvetica", "normal")
      if (invoice.from.email) {
        doc.text(invoice.from.email, margin, fromY)
        fromY += 5
      }
      
      if (invoice.from.phone) {
        doc.text(invoice.from.phone, margin, fromY)
        fromY += 5
      }
      
      // Tambahkan NPWP jika ada
      if (invoice.from.npwp) {
        doc.text(`NPWP: ${invoice.from.npwp}`, margin, fromY)
        fromY += 5
      }
      
      // Handle multiline address
      fromY = addMultiLineText(
        invoice.from.address || "", 
        margin, 
        fromY,
        (pageWidth / 2) - margin - 5
      )
      
      // Format To address
      let toY = y
      doc.setFont("helvetica", "bold")
      doc.text(invoice.to.name || "", pageWidth / 2 + 5, toY)
      toY += 5
      
      doc.setFont("helvetica", "normal")
      if (invoice.to.email) {
        doc.text(invoice.to.email, pageWidth / 2 + 5, toY)
        toY += 5
      }
      
      if (invoice.to.phone) {
        doc.text(invoice.to.phone, pageWidth / 2 + 5, toY)
        toY += 5
      }
      
      // Tambahkan NPWP klien jika ada
      if (invoice.to.npwp) {
        doc.text(`NPWP: ${invoice.to.npwp}`, pageWidth / 2 + 5, toY)
        toY += 5
      }
      
      // Handle multiline address
      toY = addMultiLineText(
        invoice.to.address || "", 
        pageWidth / 2 + 5, 
        toY,
        (pageWidth / 2) - margin - 5
      )
      
      // Move to the position after the tallest address block
      y = Math.max(fromY, toY) + 10
      
      // --- Table section ---
      // Define column positions and widths
      const tableX = margin
      const tableWidth = pageWidth - (margin * 2)
      
      const cols = {
        desc: { x: tableX, width: tableWidth * 0.55 },
        qty: { x: tableX + (tableWidth * 0.55), width: tableWidth * 0.15 },
        price: { x: tableX + (tableWidth * 0.7), width: tableWidth * 0.15 },
        total: { x: tableX + (tableWidth * 0.85), width: tableWidth * 0.15 }
      }
      
      // Check if we need to add a new page
      const checkPageBreak = (requiredHeight: number) => {
        if (y + requiredHeight > pageHeight - margin * 2) {
          doc.addPage()
          y = margin
          return true
        }
        return false
      }
      
      // Table headers
      const drawTableHeader = () => {
        doc.setFont("helvetica", "bold")
        doc.text("Deskripsi", cols.desc.x, y)
        doc.text("Jumlah", cols.qty.x + cols.qty.width, y, { align: 'right' })
        doc.text("Harga", cols.price.x + cols.price.width, y, { align: 'right' })
        doc.text("Total", cols.total.x + cols.total.width, y, { align: 'right' })
        
        y += 2
        doc.setLineWidth(0.5)
        doc.line(margin, y, pageWidth - margin, y)
        y += 5
      }
      
      drawTableHeader()
      
      // Add items
      doc.setFont("helvetica", "normal")
      invoice.items.forEach((item, index) => {
        // Estimate height needed for this row
        const description = item.description || "Item"
        
        // Meningkatkan jarak untuk deskripsi panjang
        const descLines = doc.splitTextToSize(description, cols.desc.width - 5)
        const lineHeight = 5
        const estimatedHeight = Math.max(descLines.length * lineHeight, 7) + 2
        
        // Check if we need a new page
        if (checkPageBreak(estimatedHeight + 10)) {
          drawTableHeader()
        }
        
        // Item description
        doc.text(descLines, cols.desc.x, y)
        
        // Calculate actual height used for this row
        const actualHeight = Math.max(descLines.length * lineHeight, 7)
        
        // Right-aligned numeric values - diposisikan di tengah secara vertikal relatif terhadap deskripsi
        const valueYPos = y + (actualHeight / 2) - (lineHeight / 2)
        
        doc.text(
          `${item.quantity}`, 
          cols.qty.x + cols.qty.width, 
          valueYPos, 
          { align: 'right' }
        )
        
        doc.text(
          formatCurrency(item.price).replace('Rp', ''), 
          cols.price.x + cols.price.width, 
          valueYPos, 
          { align: 'right' }
        )
        
        doc.text(
          formatCurrency(item.quantity * item.price).replace('Rp', ''), 
          cols.total.x + cols.total.width, 
          valueYPos, 
          { align: 'right' }
        )
        
        // Move to next row - height berdasarkan tinggi aktual deskripsi
        y += actualHeight + 4
      })
      
      // Draw a line after the items
      doc.setLineWidth(0.5)
      doc.setDrawColor(0, 0, 0)
      doc.line(margin, y, pageWidth - margin, y)
      y += 7
      
      // Calculate total
      const total = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
      
      // Check if summary needs a new page
      if (checkPageBreak(40)) {
        // We're on a new page, no need to add extra spacing
      }
      
      // Add subtotal and total
      const subtotalText = formatCurrency(total).replace('Rp', '')
      const totalText = formatCurrency(total).replace('Rp', '')
      
      // Subtotal row
      doc.setFont("helvetica", "normal")
      doc.text("Subtotal", cols.price.x, y)
      doc.text(subtotalText, cols.total.x + cols.total.width, y, { align: 'right' })
      
      y += 7
      
      // Total row with double line
      doc.setLineWidth(0.5)
      doc.line(cols.price.x - 5, y - 3, pageWidth - margin, y - 3)
      
      // Tambahkan jarak tambahan setelah garis untuk label TOTAL
      y += 4
      
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text("TOTAL", cols.price.x, y)
      doc.text(totalText, cols.total.x + cols.total.width, y, { align: 'right' })
      
      // Reset font size
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      
      // Sesuaikan jarak untuk bagian berikutnya
      y += 15
      
      // --- Payment Information section ---
      // Check if payment info needs a new page
      if (checkPageBreak(30)) {
        // We're on a new page, no need to add extra spacing
      }
      
      // Add payment information in a box
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.5)
      doc.rect(margin, y, pageWidth - (margin * 2), 25)
      
      y += 7
      doc.setFont("helvetica", "bold")
      doc.text("Instruksi Pembayaran", margin + 5, y)
      
      y += 7
      doc.setFont("helvetica", "normal")
      
      // Format payment info to fit within box
      const paymentText = `Bank: ${invoice.payment.bank || ""}   |   Rekening: ${invoice.payment.accountNumber || ""}   |   A/N: ${invoice.payment.accountName || ""}`
      const paymentLines = doc.splitTextToSize(paymentText, pageWidth - (margin * 2) - 10)
      doc.text(paymentLines, margin + 5, y)
      
      // --- Notes section ---
      if (invoice.notes) {
        y += 20
        
        // Check if notes need a new page
        if (checkPageBreak(20)) {
          // We're on a new page, no need to add extra spacing
        }
        
        doc.setFont("helvetica", "bold")
        doc.text("Catatan", margin, y)
        y += 7
        
        doc.setFont("helvetica", "normal")
        const noteLines = doc.splitTextToSize(invoice.notes, pageWidth - (margin * 2))
        doc.text(noteLines, margin, y)
        
        // Adjust y position based on notes height
        y += noteLines.length * 5 + 10
      }
      
      // --- Footer section ---
      // Check if we need to add a new page for the footer
      if (y > pageHeight - margin * 2) {
        doc.addPage()
        y = pageHeight - margin * 2
      } else {
        y = pageHeight - margin
      }
      
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text("Terima kasih atas kepercayaan Anda!", pageWidth / 2, y, { align: 'center' })
      
      // Save PDF
      doc.save(`faktur-${invoice.number}.pdf`)
      
      console.log("PDF generated successfully")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.")
    }
  }

  return (
    <Button
      onClick={generatePDF}
      className={className}
    >
      <span className="hidden xs:inline">Generate PDF</span>
      <span className="xs:hidden">PDF</span>
    </Button>
  )
}
