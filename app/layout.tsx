import { Geist, Geist_Mono } from "next/font/google";
import SessionProvider from "./components/SessionProvider"
import { getServerSession } from "next-auth";
import "./globals.css";
import SideBarWarper from "./components/sideBar-warper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <SideBarWarper>
          {children}
          </ SideBarWarper>
        </SessionProvider>
      </body>
    </html>
  );
}
