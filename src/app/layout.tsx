import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { Providers } from "../components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-black antialiased`}
      >
        <Providers>
          {children}

          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                // Main Container: Sharper border for better definition
                toast:
                  "group toast rounded-[1.8rem] bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-5 flex gap-4 items-center",

                // Title: Absolute black
                title:
                  "font-sans font-black uppercase tracking-[0.2em] text-[10px] text-black dark:text-white",

                // Description: ULTRA CONTRAST FIX
                // Changed to zinc-800 and weight-500 for maximum legibility on white
                description:
                  "font-serif italic font-medium text-[14px] text-zinc-800 dark:text-zinc-300 mt-1 leading-relaxed",

                icon: "text-black dark:text-white",

                success: "border-green-600/50 bg-white",
                error: "border-red-600/50 bg-white",

                actionButton:
                  "rounded-full bg-black text-white font-black text-[9px] uppercase tracking-widest px-5 h-8",
                cancelButton:
                  "rounded-full bg-zinc-100 text-zinc-900 font-black text-[9px] uppercase tracking-widest px-5 h-8",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
