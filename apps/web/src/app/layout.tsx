import type { Metadata } from 'next';
import './globals.css';
import { getSiteData } from '@/lib/api';
import { Header, Footer } from '@/components/Layout';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { site } = await getSiteData();
    return {
      title: { default: site.siteName, template: `%s · ${site.siteName}` },
      description: site.tagline,
    };
  } catch {
    return { title: 'Nayab Tahir' };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let site: Record<string, string> = { siteName: 'Nayab Tahir', owner: 'Nayab Tahir', company: '', companyUrl: '' };
  try {
    const data = await getSiteData();
    site = data.site as Record<string, string>;
  } catch {
    /* API may be offline during static export */
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer site={site} />
      </body>
    </html>
  );
}
