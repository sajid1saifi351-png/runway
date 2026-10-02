import type {Metadata, Viewport} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RAN AWAY: Indian Escape',
  description: 'A high-octane 3D mobile endless runner where adventurer Sajid escapes ancient Indian temples, lush jungles, and desert ruins while outrunning mythical guardians.',
  openGraph: {
    title: 'RAN AWAY: Indian Escape',
    description: 'A high-octane 3D mobile endless runner where adventurer Sajid escapes ancient Indian temples, lush jungles, and desert ruins while outrunning mythical guardians.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAN AWAY: Indian Escape',
    description: 'A high-octane 3D mobile endless runner where adventurer Sajid escapes ancient Indian temples, lush jungles, and desert ruins while outrunning mythical guardians.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#d97706',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full w-full select-none bg-black overflow-hidden">
      <body suppressHydrationWarning className="h-full w-full overflow-hidden bg-black text-white antialiased font-sans touch-none">
        {children}
      </body>
    </html>
  );
}
