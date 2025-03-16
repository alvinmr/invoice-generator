"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Invoice, InvoiceItem, defaultInvoice, dummyInvoice } from "@/lib/invoice-types"
import { useEffect, useState } from "react"
import { InvoicePDFGenerator } from "./invoice-pdf-generator"
import { InvoicePreview } from "./invoice-preview"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Check, Info, Plus, Trash2, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function InvoiceForm() {
  const [invoice, setInvoice] = useState<Invoice>(defaultInvoice)
  const [showPreview, setShowPreview] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [deleteItemIndex, setDeleteItemIndex] = useState<number | null>(null)
  const [isSavingData, setIsSavingData] = useState<boolean>(false)
  
  // Calculate form completion progress
  useEffect(() => {
    // Define critical fields that must be filled
    const requiredFields = [
      !!invoice.number,
      !!invoice.date,
      !!invoice.dueDate,
      !!invoice.from.name,
      !!invoice.to.name,
      !!invoice.items.length,
      invoice.items.every(item => !!item.description && item.price > 0),
      !!invoice.payment.bank
    ];
    
    // Calculate percentage
    const completedFields = requiredFields.filter(Boolean).length;
    const progress = Math.round((completedFields / requiredFields.length) * 100);
    
    setFormProgress(progress);
  }, [invoice]);

  const updateInvoiceField = (field: string, value: any) => {
    setInvoice(prev => ({ ...prev, [field]: value }))
  }

  const updateFromField = (field: string, value: string) => {
    setInvoice(prev => ({
      ...prev,
      from: {
        ...prev.from,
        [field]: value
      }
    }))
  }

  const updateToField = (field: string, value: string) => {
    setInvoice(prev => ({
      ...prev,
      to: {
        ...prev.to,
        [field]: value
      }
    }))
  }

  const updatePaymentField = (field: string, value: string) => {
    setInvoice(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        [field]: value
      }
    }))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoice(prev => {
      const newItems = [...prev.items]
      newItems[index] = { 
        ...newItems[index], 
        [field]: field === 'quantity' || field === 'price' ? Number(value) : value 
      }
      return { ...prev, items: newItems }
    })
  }

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, price: 0 }]
    }))
  }

  const removeItem = (index: number) => {
    if (invoice.items.length > 1) {
      setInvoice(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }))
    }
    setDeleteItemIndex(null)
  }
  
  const confirmDeleteItem = (index: number) => {
    setDeleteItemIndex(index)
  }

  const loadDummyData = () => {
    setIsSavingData(true)
    
    // Simulate loading with a short delay
    setTimeout(() => {
      setInvoice(dummyInvoice)
      setIsSavingData(false)
    }, 800)
  }
  
  const calculateRowTotal = (item: InvoiceItem) => {
    return item.quantity * item.price;
  }
  
  const calculateInvoiceTotal = () => {
    return invoice.items.reduce((total, item) => total + calculateRowTotal(item), 0);
  }
  
  // Field validation functions
  const isFieldInvalid = (value: string | number | null | undefined): boolean => {
    return value === null || value === undefined || value === '';
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div>
              <CardTitle className="text-xl">Informasi Faktur</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={formProgress} className="h-2 w-40" />
                <span className="text-sm text-muted-foreground">{formProgress}% Terisi</span>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadDummyData} 
                    disabled={isSavingData}
                    className="min-w-32"
                  >
                    {isSavingData ? (
                      <>
                        <span className="animate-pulse mr-1">Mengisi Data</span>...
                      </>
                    ) : (
                      "Load Dummy Data"
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Isi form dengan data contoh</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber" className="flex items-center gap-1">
                  Nomor Faktur
                  {isFieldInvalid(invoice.number) && (
                    <span className="text-red-500 text-xs">*</span>
                  )}
                </Label>
                <Input
                  id="invoiceNumber"
                  value={invoice.number}
                  onChange={(e) => updateInvoiceField('number', e.target.value)}
                  placeholder="INV-001"
                  onFocus={() => setFocusedField('invoiceNumber')}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    focusedField === 'invoiceNumber' && "border-primary ring-1 ring-primary",
                    isFieldInvalid(invoice.number) && "border-red-300"
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceDate" className="flex items-center gap-1">
                  Tanggal Faktur
                  {isFieldInvalid(invoice.date) && (
                    <span className="text-red-500 text-xs">*</span>
                  )}
                </Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={invoice.date}
                  onChange={(e) => updateInvoiceField('date', e.target.value)}
                  onFocus={() => setFocusedField('invoiceDate')}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    focusedField === 'invoiceDate' && "border-primary ring-1 ring-primary",
                    isFieldInvalid(invoice.date) && "border-red-300"
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="flex items-center gap-1">
                  Jatuh Tempo
                  {isFieldInvalid(invoice.dueDate) && (
                    <span className="text-red-500 text-xs">*</span>
                  )}
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => updateInvoiceField('dueDate', e.target.value)}
                  onFocus={() => setFocusedField('dueDate')}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    focusedField === 'dueDate' && "border-primary ring-1 ring-primary",
                    isFieldInvalid(invoice.dueDate) && "border-red-300"
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-2 flex justify-between items-center">
                <h3 className="font-medium text-lg">Informasi Anda</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
                      <Info className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 text-sm">
                    <p>Detail pengirim faktur yang akan ditampilkan di dokumen.</p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yourName" className="flex items-center gap-1">
                    Nama
                    {isFieldInvalid(invoice.from.name) && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                  </Label>
                  <Input
                    id="yourName"
                    value={invoice.from.name}
                    onChange={(e) => updateFromField('name', e.target.value)}
                    placeholder="Nama Anda"
                    onFocus={() => setFocusedField('yourName')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      focusedField === 'yourName' && "border-primary ring-1 ring-primary",
                      isFieldInvalid(invoice.from.name) && "border-red-300"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yourEmail">Email</Label>
                  <Input
                    id="yourEmail"
                    type="email"
                    value={invoice.from.email}
                    onChange={(e) => updateFromField('email', e.target.value)}
                    placeholder="email@anda.com"
                    onFocus={() => setFocusedField('yourEmail')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(focusedField === 'yourEmail' && "border-primary ring-1 ring-primary")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yourPhone">Telepon</Label>
                  <Input
                    id="yourPhone"
                    value={invoice.from.phone}
                    onChange={(e) => updateFromField('phone', e.target.value)}
                    placeholder="+62 8123456789"
                    onFocus={() => setFocusedField('yourPhone')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(focusedField === 'yourPhone' && "border-primary ring-1 ring-primary")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yourNpwp">
                    NPWP
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1 rounded-full">
                            <Info className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Nomor Pokok Wajib Pajak (opsional)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="yourNpwp"
                    value={invoice.from.npwp || ""}
                    onChange={(e) => updateFromField('npwp', e.target.value)}
                    placeholder="00.000.000.0-000.000"
                    onFocus={() => setFocusedField('yourNpwp')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(focusedField === 'yourNpwp' && "border-primary ring-1 ring-primary")}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="yourAddress">Alamat</Label>
                  <Textarea
                    id="yourAddress"
                    value={invoice.from.address}
                    onChange={(e) => updateFromField('address', e.target.value)}
                    placeholder="Alamat lengkap Anda"
                    rows={2}
                    onFocus={() => setFocusedField('yourAddress')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(focusedField === 'yourAddress' && "border-primary ring-1 ring-primary")}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-2 flex justify-between items-center">
                <h3 className="font-medium text-lg">Informasi Klien</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
                      <Info className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 text-sm">
                    <p>Detail penerima faktur yang akan menerima tagihan ini.</p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="flex items-center gap-1">
                    Nama Klien
                    {isFieldInvalid(invoice.to.name) && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                  </Label>
                  <Input
                    id="clientName"
                    value={invoice.to.name}
                    onChange={(e) => updateToField('name', e.target.value)}
                    placeholder="Nama Klien"
                    onFocus={() => setFocusedField('clientName')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      focusedField === 'clientName' && "border-primary ring-1 ring-primary",
                      isFieldInvalid(invoice.to.name) && "border-red-300"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email Klien</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={invoice.to.email}
                    onChange={(e) => updateToField('email', e.target.value)}
                    placeholder="klien@email.com"
                    onFocus={() => setFocusedField('clientEmail')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(focusedField === 'clientEmail' && "border-primary ring-1 ring-primary")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Telepon Klien</Label>
                  <Input
                    id="clientPhone"
                    value={invoice.to.phone}
                    onChange={(e) => updateToField('phone', e.target.value)}
                    placeholder="+62 8123456789"
                    onFocus={() => setFocusedField('clientPhone')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(focusedField === 'clientPhone' && "border-primary ring-1 ring-primary")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientNpwp">
                    NPWP Klien
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1 rounded-full">
                            <Info className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Nomor Pokok Wajib Pajak klien (opsional)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="clientNpwp"
                    value={invoice.to.npwp || ""}
                    onChange={(e) => updateToField('npwp', e.target.value)}
                    placeholder="00.000.000.0-000.000"
                    onFocus={() => setFocusedField('clientNpwp')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(focusedField === 'clientNpwp' && "border-primary ring-1 ring-primary")}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="clientAddress">Alamat Klien</Label>
                  <Textarea
                    id="clientAddress"
                    value={invoice.to.address}
                    onChange={(e) => updateToField('address', e.target.value)}
                    placeholder="Alamat lengkap klien"
                    rows={2}
                    onFocus={() => setFocusedField('clientAddress')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(focusedField === 'clientAddress' && "border-primary ring-1 ring-primary")}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-2 flex justify-between items-center">
                <h3 className="font-medium text-lg">Item Layanan</h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Total: <span className="font-medium text-foreground">{invoice.items.length} item</span>
                  </p>
                </div>
              </div>

              {invoice.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-12 gap-4 items-start border border-border rounded-lg p-3 bg-card/50"
                >
                  <div className="col-span-12 md:col-span-5 space-y-2">
                    <Label 
                      htmlFor={`itemDesc${index}`}
                      className={cn(
                        "flex items-center gap-1",
                        isFieldInvalid(item.description) && "text-red-500"
                      )}
                    >
                      Deskripsi
                      {isFieldInvalid(item.description) && (
                        <AlertCircle className="h-3 w-3" />
                      )}
                    </Label>
                    <Textarea
                      id={`itemDesc${index}`}
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Deskripsi detail layanan atau produk"
                      onFocus={() => setFocusedField(`itemDesc${index}`)}
                      onBlur={() => setFocusedField(null)}
                      rows={2}
                      className={cn(
                        "resize-none",
                        focusedField === `itemDesc${index}` && "border-primary ring-1 ring-primary",
                        isFieldInvalid(item.description) && "border-red-300"
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      Deskripsi detail bisa mencakup spesifikasi, waktu, atau catatan khusus
                    </p>
                  </div>
                  <div className="col-span-6 md:col-span-2 space-y-2 mt-0 md:mt-8">
                    <Label htmlFor={`itemQty${index}`}>Jumlah</Label>
                    <Input
                      id={`itemQty${index}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      onFocus={() => setFocusedField(`itemQty${index}`)}
                      onBlur={() => setFocusedField(null)}
                      className={cn(focusedField === `itemQty${index}` && "border-primary ring-1 ring-primary")}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3 space-y-2 mt-0 md:mt-8">
                    <Label 
                      htmlFor={`itemPrice${index}`}
                      className={cn(
                        "flex items-center gap-1",
                        item.price <= 0 && "text-red-500"
                      )}
                    >
                      Harga (Rp)
                      {item.price <= 0 && (
                        <AlertCircle className="h-3 w-3" />
                      )}
                    </Label>
                    <Input
                      id={`itemPrice${index}`}
                      type="number"
                      min={0}
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', e.target.value)}
                      onFocus={() => setFocusedField(`itemPrice${index}`)}
                      onBlur={() => setFocusedField(null)}
                      className={cn(
                        focusedField === `itemPrice${index}` && "border-primary ring-1 ring-primary",
                        item.price <= 0 && "border-red-300"
                      )}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-2 flex flex-row md:flex-col justify-between items-center md:items-end md:mt-8 gap-2">
                    <p className="text-sm text-muted-foreground">
                      Total: <span className="font-semibold text-foreground">Rp {calculateRowTotal(item).toLocaleString()}</span>
                    </p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => confirmDeleteItem(index)}
                            disabled={invoice.items.length <= 1}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hapus item ini</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              ))}
              
              <Button 
                variant="outline" 
                onClick={addItem} 
                className="w-full flex items-center gap-2 mt-2"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Item</span>
              </Button>
              
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Subtotal:</span>
                  <span className="font-medium">Rp {calculateInvoiceTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t">
                  <span className="font-semibold">TOTAL:</span>
                  <span className="font-bold text-lg">Rp {calculateInvoiceTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-2 flex justify-between items-center">
                <h3 className="font-medium text-lg">Pembayaran</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
                      <Info className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 text-sm">
                    <p>Informasi rekening bank untuk pembayaran faktur ini.</p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName" className="flex items-center gap-1">
                    Bank
                    {isFieldInvalid(invoice.payment.bank) && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                  </Label>
                  <Input
                    id="bankName"
                    value={invoice.payment.bank}
                    onChange={(e) => updatePaymentField('bank', e.target.value)}
                    placeholder="Nama Bank"
                    onFocus={() => setFocusedField('bankName')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      focusedField === 'bankName' && "border-primary ring-1 ring-primary",
                      isFieldInvalid(invoice.payment.bank) && "border-red-300"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Nomor Rekening</Label>
                  <Input
                    id="accountNumber"
                    value={invoice.payment.accountNumber}
                    onChange={(e) => updatePaymentField('accountNumber', e.target.value)}
                    placeholder="Nomor Rekening"
                    onFocus={() => setFocusedField('accountNumber')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(focusedField === 'accountNumber' && "border-primary ring-1 ring-primary")}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="accountName">Nama Pemilik Rekening</Label>
                  <Input
                    id="accountName"
                    value={invoice.payment.accountName}
                    onChange={(e) => updatePaymentField('accountName', e.target.value)}
                    placeholder="Nama Pemilik Rekening"
                    onFocus={() => setFocusedField('accountName')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(focusedField === 'accountName' && "border-primary ring-1 ring-primary")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={invoice.notes}
                  onChange={(e) => updateInvoiceField('notes', e.target.value)}
                  placeholder="Catatan tambahan untuk klien"
                  rows={2}
                  onFocus={() => setFocusedField('notes')}
                  onBlur={() => setFocusedField(null)}
                  className={cn(focusedField === 'notes' && "border-primary ring-1 ring-primary")}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-4 border-t pt-4">
            <div>
              {formProgress < 100 && (
                <p className="text-sm text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Harap lengkapi semua data yang wajib (*)</span>
                </p>
              )}
              {formProgress === 100 && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  <span>Formulir telah lengkap</span>
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? "Tutup Pratinjau" : "Pratinjau"}
              </Button>
              <InvoicePDFGenerator invoice={invoice} />
            </div>
          </CardFooter>
        </Card>
      </div>

      {showPreview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="hidden lg:block sticky top-4"
        >
          <InvoicePreview invoice={invoice} />
        </motion.div>
      )}

      {/* Mobile Preview */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden"
        >
          <InvoicePreview invoice={invoice} />
        </motion.div>
      )}
      
      {/* Delete item confirmation dialog */}
      <AlertDialog open={deleteItemIndex !== null} onOpenChange={() => setDeleteItemIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus item ini dari faktur?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteItemIndex !== null && removeItem(deleteItemIndex)}
              className="bg-red-500 hover:bg-red-600"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
