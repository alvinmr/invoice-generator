import { InvoiceForm } from "@/components/invoice-form"
import { ThemeToggle } from "@/components/theme-toggle"
import "react-day-picker/style.css";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-3 sm:p-4 md:p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Generator Faktur</h1>
            <p className="text-sm text-muted-foreground">Buat faktur profesional dengan mudah</p>
          </div>
          <ThemeToggle />
        </header>
        <InvoiceForm />
        <footer className="mt-8 text-center text-xs sm:text-sm text-muted-foreground py-4">
          <p>© {new Date().getFullYear()} Generator Faktur - Dibuat untuk memudahkan saya sendiri</p>
        </footer>
      </div>
    </main>
  )
}
