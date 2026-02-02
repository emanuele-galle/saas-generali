import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#C21D17]">
        <span className="text-2xl font-bold text-white">G</span>
      </div>
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Pagina non trovata
      </p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        La pagina che stai cercando non esiste o potrebbe essere stata spostata.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-md bg-[#C21D17] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#9B1610]"
      >
        Torna alla homepage
      </Link>
    </div>
  );
}
