import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container max-w-7xl py-6">
          <header className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">🧪 Data Alchemist</h1>
          </header>
          <main className="mt-6">{children}</main>
          <footer className="mt-10 text-sm opacity-70">
            MIT License · Built with Next.js
          </footer>
        </div>
      </body>
    </html>
  );
}
