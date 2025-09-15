import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/posts';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.meta.title ?? 'Blog';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, #0b1220, #1f2937)',
          color: '#fff',
          padding: '72px',
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            opacity: 0.9,
            marginBottom: 10,
          }}
        >
          Nabil Saragih — Blog
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            maxWidth: 1000,
            display: 'block',
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}

