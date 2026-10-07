import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { WelcomeOverlay } from "@/components/layout/WelcomeOverlay";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { MotionSafe } from "@/components/motion/MotionSafe";
import { AIAssistantFloating } from "@/features/ai-assistant/components/AIAssistantFloating";
import { CartProvider } from "@/features/cart/store/cart.store";
import { AuthProvider } from "@/features/auth/store/auth.store";
import { OrdersProvider } from "@/features/checkout/store/orders.store";
import { WishlistProvider } from "@/features/wishlist/store/wishlist.store";
import { CompareProvider } from "@/features/compare/store/compare.store";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Giant Store",
    template: "%s | Giant Store",
  },
  description:
    "A scalable premium ecommerce platform built with Next.js App Router, TypeScript, and Tailwind CSS.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('fx-boot')",
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground overflow-x-hidden">
        <MotionSafe>
          <AuthProvider>
            <OrdersProvider>
              <WishlistProvider>
                <CompareProvider>
                  <CartProvider>
                    <Header />
                    <div className="flex-1 pb-16 md:pb-0">{children}</div>
                    <Footer />
                    <MobileNav />
                    <AIAssistantFloating />
                    <WelcomeOverlay locale="en" />
                  </CartProvider>
                </CompareProvider>
              </WishlistProvider>
            </OrdersProvider>
          </AuthProvider>
        </MotionSafe>
      </body>
    </html>
  );
}
