import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Happy 2nd Anniversary, Dearly Beloved San ❤️ | LDR Edition',
  description:
    'Rekap 2 tahun perjalanan cinta sejak 8 Oktober 2024 dan perjuangan LDR sejak 31 Juli bersama San tersayang.',
  openGraph: {
    title: 'Happy 2nd Anniversary, Dearly Beloved San ❤️ | LDR Edition',
    description:
      'Rekap 2 tahun perjalanan cinta sejak 8 Oktober 2024 dan perjuangan LDR sejak 31 Juli bersama San tersayang.',
    type: 'website',
  },
};

export default function AnniversaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

