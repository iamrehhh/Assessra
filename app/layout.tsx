import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: "Assessra",
  description: "AI-powered past paper platform for AS & A Level students",
};

export const maxDuration = 300;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Blocking script to prevent theme flash (FOUC). Reads from localStorage
  // before React hydrates, so the correct class is applied before first paint.
  const themeScript = `
    (function() {
      try {
        var theme = localStorage.getItem('theme') || 'dark';
        document.documentElement.classList.add(theme);
        document.documentElement.style.colorScheme = theme;
      } catch(e) {}
    })();
  `;

  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
