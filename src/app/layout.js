import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { Providers } from "@/Components/Providers";

export const inter = Inter({
  subsets:["latin"],
  weight:["400","500","600","700"],
  display:"swap",
  variable:"--font-inter"
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Touti",
  description: "Brinde com um toque de elegância a sua vida.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`} >
        <Providers/>
        {children}
      </body>
    </html>
  );
}
