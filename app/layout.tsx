import { Geist, Geist_Mono } from "next/font/google";
import SessionProvider from "./components/SessionProvider"
import { ThemeProvider } from "./providers/theme-provider"
import { getTheme } from "@/utils/theme"
import "./globals.css";
import SideBarWarper from "./components/sideBar-warper";
import { Toaster } from "@/components/ui/toaster";

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
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com"/>
<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet"/>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
        <SessionProvider>
          <ThemeProvider defaultTheme={getTheme()}>
          <SideBarWarper>
            {children}
            <Toaster />
          </ SideBarWarper>           
          </ ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
