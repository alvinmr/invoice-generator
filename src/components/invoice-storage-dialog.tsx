import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Download, FileText, Save, Trash2, X } from "lucide-react";
import { StoredInvoice, useInvoiceStorage } from "@/lib/use-invoice-storage";
import { formatDate, cn } from "@/lib/utils";
import { Invoice } from "@/lib/invoice-types";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface InvoiceStorageDialogProps {
  currentInvoice: Invoice;
  onLoadInvoice: (invoice: Invoice) => void;
  variant?: "outline" | "default";
  triggerLabel?: string;
  className?: string;
}

export function InvoiceStorageDialog({
  currentInvoice,
  onLoadInvoice,
  variant = "outline",
  triggerLabel = "Invoice Tersimpan",
  className
}: InvoiceStorageDialogProps) {
  const { invoices, saveInvoice, deleteInvoice } = useInvoiceStorage();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveInvoice = () => {
    const success = saveInvoice(currentInvoice);
    setSaveSuccess(success);
    
    // Reset success message after delay
    if (success) {
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleLoadInvoice = (storedInvoice: StoredInvoice) => {
    onLoadInvoice(storedInvoice.invoice);
    setOpen(false);
  };

  const handleDeleteInvoice = () => {
    if (deleteId) {
      deleteInvoice(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={variant} className={cn("gap-2", className)}>
            <FileText className="h-4 w-4" />
            <span className="hidden xs:inline">{triggerLabel}</span>
            <span className="xs:hidden">{triggerLabel === "Invoice Tersimpan" ? "Tersimpan" : triggerLabel}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice Tersimpan</DialogTitle>
            <DialogDescription>
              Lihat dan kelola invoice yang telah Anda simpan sebelumnya.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 my-2">
            <p className="text-sm text-muted-foreground">
              Total: <span className="font-medium">{invoices.length} invoice</span>
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {saveSuccess && (
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-green-600 hidden sm:block"
                >
                  Invoice berhasil disimpan!
                </motion.p>
              )}
              <Button 
                variant="outline" 
                onClick={handleSaveInvoice}
                className="gap-2 w-full sm:w-auto"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Simpan Invoice Saat Ini</span>
                <span className="sm:hidden">Simpan</span>
              </Button>
              {saveSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-green-600 sm:hidden text-center w-full mt-1"
                >
                  Invoice berhasil disimpan!
                </motion.p>
              )}
            </div>
          </div>

          <div className="border rounded-md">
            <ScrollArea className={invoices.length > 0 ? "h-[350px]" : "h-auto"}>
              {invoices.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Belum ada invoice tersimpan.</p>
                  <p className="text-sm mt-1">Klik tombol "Simpan Invoice Saat Ini" untuk mulai menyimpan.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {invoices.map((storedInvoice) => (
                    <div 
                      key={storedInvoice.id} 
                      className="p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{storedInvoice.invoice.number}</h3>
                          <p className="text-sm text-muted-foreground">
                            {storedInvoice.invoice.to.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Disimpan: {formatDate(storedInvoice.updatedAt.split('T')[0])}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleLoadInvoice(storedInvoice)}
                            className="h-8"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Muat
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setDeleteId(storedInvoice.id)}
                            className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              Invoice yang dihapus tidak dapat dikembalikan. Apakah Anda yakin ingin melanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteInvoice}
              className="bg-red-500 hover:bg-red-600"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
