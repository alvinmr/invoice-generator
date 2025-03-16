import { InvoiceForm } from "@/components/invoice-form"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Generator Faktur</h1>
        <p className="text-muted-foreground">
          Buat faktur profesional untuk klien Anda dengan mudah
        </p>
      </header>

      <InvoiceForm />
    </main>
  )
}
