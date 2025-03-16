import { InvoiceForm } from "@/components/invoice-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Generator Faktur</h1>
            <p className="text-muted-foreground">Buat faktur profesional dengan mudah</p>
          </div>
          <ThemeToggle />
        </header>
        <InvoiceForm />
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Generator Faktur - Dibuat untuk memudahkan saya sendiri</p>
        </footer>
      </div>
    </main>
  )
}
