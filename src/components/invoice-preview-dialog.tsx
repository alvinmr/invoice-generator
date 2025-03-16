import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Invoice } from "@/lib/invoice-types";
import { InvoicePreview } from "./invoice-preview";
import { InvoicePDFGenerator } from "./invoice-pdf-generator";

interface InvoicePreviewDialogProps {
  invoice: Invoice;
  className?: string;
  triggerLabel?: string;
}

export function InvoicePreviewDialog({
  invoice,
  className,
  triggerLabel = "Pratinjau"
}: InvoicePreviewDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Eye className="h-4 w-4 mr-2" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 mb-4 border-b">
          <div>
            <DialogTitle>Pratinjau Faktur</DialogTitle>
            <DialogDescription>
              Tampilan faktur yang akan dicetak
            </DialogDescription>
          </div>
          {/* Gunakan komponen InvoicePDFGenerator yang sudah ada untuk fitur cetak */}
          <InvoicePDFGenerator 
            invoice={invoice}
            variant="outline"
            size="sm" 
            className="gap-2"
          />
        </DialogHeader>
        
        <div className="pt-2">
          <InvoicePreview invoice={invoice} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
