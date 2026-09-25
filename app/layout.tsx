import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1 Stats",
  description: "Dashboard de estatisticas e acompanhamento da Formula 1.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
