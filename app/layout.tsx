import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: "Assessra — AI-Powered Exam Preparation",
  description: "Master your AS & A Level exams with AI-powered past paper practice, intelligent grading, and comprehensive study tools.",
  keywords: "AS Level, A Level, past papers, exam preparation, AI grading, Cambridge",
};

export const maxDuration = 300;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Minimal blocking script to prevent theme flash (FOUC)
  const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t}catch(e){}})()`;

  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
